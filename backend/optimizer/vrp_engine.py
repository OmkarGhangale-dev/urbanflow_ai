from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
from optimizer.scoring import calculate_route_score
from optimizer.explanation import generate_route_explanation
from optimizer.matrix import load_locations


def optimize_routes(
    distance_matrix,
    demands,
    vehicle_capacities,
    starts,
    ends,
    priorities=None,
    traffic_matrix=None,
    blocked_edges=None,
    weights=None,
    location_ids=None,
    traffic_events_raw=None,  # dictionary mapping (from_code, to_code) -> level
    allowed_vehicles=None      # list/dict of allowed vehicle indices per node
):
    """
    Multi-depot Vehicle Routing Problem with capacity, priorities, and traffic.
    Returns optimized routes with detailed metrics and explanations.
    """
    num_locations = len(distance_matrix)
    num_vehicles = len(vehicle_capacities)
    locations_map = load_locations()

    if weights is None:
        weights = {
            "distance": 1.0,
            "traffic": 2.0,
            "priority": 10.0,
            "utilization": 5.0
        }

    # ---------------------------------------
    # Create routing manager
    # ---------------------------------------
    manager = pywrapcp.RoutingIndexManager(
        num_locations,
        num_vehicles,
        starts,
        ends
    )

    routing = pywrapcp.RoutingModel(manager)

    # ---------------------------------------
    # Blocked roads / road closures
    # ---------------------------------------
    if blocked_edges is not None:
        for from_node, to_node in blocked_edges:
            from_index = manager.NodeToIndex(from_node)
            to_index = manager.NodeToIndex(to_node)

            if from_index != -1 and to_index != -1:
                routing.solver().Add(
                    routing.NextVar(from_index) != to_index
                )

    # ---------------------------------------
    # Vehicle-Node Compatibility Constraints
    # ---------------------------------------
    if allowed_vehicles is not None:
        for node, vehicles_list in allowed_vehicles.items():
            index = manager.NodeToIndex(int(node))
            if index != -1:
                routing.VehicleVar(index).SetValues([int(v) for v in vehicles_list])

    # ---------------------------------------
    # Distance/Transit Callback
    # ---------------------------------------
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)

        # Traffic-adjusted distance
        if traffic_matrix is not None:
            distance = traffic_matrix[from_node][to_node]
        else:
            distance = distance_matrix[from_node][to_node]

        # OR-Tools requires integer costs. Scale by 100 for precision.
        return int(distance * 100)

    distance_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(distance_callback_index)

    # ---------------------------------------
    # Add Distance Dimension
    # ---------------------------------------
    routing.AddDimension(
        distance_callback_index,
        0,  # null capacity slack
        1000000,  # vehicle maximum travel distance (scaled)
        True,  # start cumul to zero
        "Distance"
    )
    distance_dimension = routing.GetMutableDimension("Distance")

    # ---------------------------------------
    # Priority-Aware Soft Bounds
    # ---------------------------------------
    # We want to visit high-priority nodes early. By setting a soft upper bound of 0
    # at delivery locations with a penalty coefficient proportional to priority,
    # OR-Tools will minimize the arrival distance (i.e. visit them early).
    if priorities is not None:
        p_weight = weights.get("priority", 10.0)
        for node in range(num_locations):
            index = manager.NodeToIndex(node)
            if index != -1 and priorities[node] > 0:
                # priorities[node] holds the priority values: low=1, normal=2, high=4, critical=8
                priority_val = priorities[node]
                # Scale the coefficient to balance with travel distance cost
                coeff = int(priority_val * p_weight * 10)
                distance_dimension.SetCumulVarSoftUpperBound(index, 0, coeff)

    # ---------------------------------------
    # Capacity constraint
    # ---------------------------------------
    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return int(demands[from_node])

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        vehicle_capacities,
        True,  # start capacity to zero
        "Capacity"
    )

    # ---------------------------------------
    # Search configuration
    # ---------------------------------------
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    # Give the optimizer 2 seconds limit for fast responsive hackathon feel
    search_parameters.time_limit.seconds = 2

    # ---------------------------------------
    # Solve
    # ---------------------------------------
    solution = routing.SolveWithParameters(search_parameters)

    if not solution:
        return {
            "status": "no_solution",
            "routes": []
        }

    # ---------------------------------------
    # Extract routes and calculate scoring
    # ---------------------------------------
    routes = []
    priority_strings = {1: "low", 2: "normal", 4: "high", 8: "critical"}

    for vehicle_id in range(num_vehicles):
        index = routing.Start(vehicle_id)
        route_nodes = []
        route_base_distance = 0.0
        route_traffic_distance = 0.0
        route_load = 0
        urgency_penalty_sum = 0.0
        priorities_served = []
        traffic_impacts_encountered = []

        # Track cumulative distance for priority scoring
        cumul_dist = 0.0

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            route_nodes.append(node)
            route_load += demands[node]

            # Priority tracking
            if priorities is not None and priorities[node] > 0:
                p_val = priorities[node]
                priorities_served.append(priority_strings.get(p_val, "normal"))
                # Urgency penalty is the arrival distance * priority weight
                urgency_penalty_sum += cumul_dist * p_val

            previous_index = index
            index = solution.Value(routing.NextVar(index))

            from_node = manager.IndexToNode(previous_index)
            to_node = manager.IndexToNode(index)

            # Distances
            base_dist = distance_matrix[from_node][to_node]
            traffic_dist = traffic_matrix[from_node][to_node] if traffic_matrix is not None else base_dist

            route_base_distance += base_dist
            route_traffic_distance += traffic_dist
            cumul_dist += traffic_dist

            # Check traffic event level using codes if available
            if location_ids and traffic_events_raw:
                from_code = location_ids[from_node]
                to_code = location_ids[to_node]
                # Check directional incident
                evt = traffic_events_raw.get((from_code, to_code)) or traffic_events_raw.get((to_code, from_code))
                if evt:
                    traffic_impacts_encountered.append(evt.get("level", "normal"))

        # Add ending depot node
        end_node = manager.IndexToNode(index)
        route_nodes.append(end_node)

        # Capacity & Utilization
        capacity = vehicle_capacities[vehicle_id]
        utilization_pct = (route_load / capacity) * 100.0 if capacity > 0 else 0.0

        # Traffic delay
        traffic_delay = max(0.0, route_traffic_distance - route_base_distance)
        traffic_status = "normal"
        if traffic_impacts_encountered:
            # Pick the most severe level encountered
            for level in ["blocked", "closure", "severe", "heavy", "moderate"]:
                if level in traffic_impacts_encountered:
                    traffic_status = level
                    break

        # Calculate UrbanFlow Score
        score_res = calculate_route_score(
            distance_km=route_traffic_distance,
            traffic_delay_km=traffic_delay,
            urgency_penalty=urgency_penalty_sum,
            utilization_pct=utilization_pct,
            weights=weights
        )

        route_score = score_res["total_score"]
        score_breakdown = score_res["breakdown"]

        # Find critical and high priority locations in the route
        critical_locations = []
        high_locations = []
        for node in route_nodes:
            if priorities is not None and location_ids is not None:
                p_val = priorities[node]
                code = location_ids[node]
                # Skip depots
                if code.startswith("D"):
                    continue
                name = locations_map.get(code, {}).get("name", code)
                loc_str = f"{code} ({name})"
                if p_val == 8:
                    critical_locations.append(loc_str)
                elif p_val == 4:
                    high_locations.append(loc_str)

        # Generate Explanation
        explanation = generate_route_explanation(
            vehicle_code=f"V{vehicle_id+1:02d}", # placeholder, replaced in main.py with actual code
            route_length=len(route_nodes),
            load=route_load,
            capacity=capacity,
            priorities_served=priorities_served,
            traffic_impact=traffic_status,
            score=route_score,
            critical_locations=critical_locations,
            high_locations=high_locations
        )

        routes.append({
            "vehicle_id": vehicle_id,
            "route": route_nodes,
            "distance_km": round(route_traffic_distance, 2),
            "load": route_load,
            "capacity": capacity,
            "utilization_pct": round(utilization_pct, 1),
            "priorities_served": list(set(priorities_served)),
            "traffic_impact": traffic_status,
            "urbanflow_score": route_score,
            "score_breakdown": score_breakdown,
            "optimization_reason": explanation
        })

    return {
        "status": "optimized",
        "routes": routes
    }