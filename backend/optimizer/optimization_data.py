from optimizer.matrix import build_distance_matrix
from optimizer.traffic import apply_traffic


def prepare_route_data(vehicles, orders):
    """
    Convert database vehicles and orders into
    data required by the routing engine.

    Supports different starting depots for vehicles.
    """

    # --------------------------------
    # 1. Collect vehicle starting locations
    # --------------------------------

    location_ids = []

    for vehicle in vehicles:
        if vehicle.current_location not in location_ids:
            location_ids.append(vehicle.current_location)

    # --------------------------------
    # 2. Add delivery locations
    # --------------------------------

    for order in orders:
        if order.delivery_location not in location_ids:
            location_ids.append(order.delivery_location)

    # --------------------------------
    # 3. Build real distance matrix
    # --------------------------------

    distance_matrix = build_distance_matrix(location_ids)

    # --------------------------------
    # 4. Map locations → matrix index
    # --------------------------------

    location_index = {
        location_id: index
        for index, location_id in enumerate(location_ids)
    }

    # --------------------------------
    # 5. Vehicle starting points
    # --------------------------------

    starts = []

    for vehicle in vehicles:
        starts.append(
            location_index[vehicle.current_location]
        )

    # --------------------------------
    # 6. Vehicle ending points
    #
    # For now vehicles return to
    # their original starting depot.
    # --------------------------------

    ends = starts.copy()

   # --------------------------------
    # 7. Order demands + priorities
    # --------------------------------

    demands = [0] * len(location_ids)

    priorities = [0] * len(location_ids)

    priority_values = {
        "low": 1,
        "normal": 2,
        "high": 4,
        "critical": 8
    }

    for order in orders:

        index = location_index[order.delivery_location]

        # Add delivery weight
        demands[index] += int(order.weight)

        # Keep the highest priority at a location
        priority = priority_values.get(
            str(order.priority).lower(),
            2
        )

        priorities[index] = max(
            priorities[index],
            priority
        )

    # --------------------------------
    # 8. Vehicle capacities
    # --------------------------------

    vehicle_capacities = [
        int(vehicle.capacity)
        for vehicle in vehicles
    ]

    # 9. Allowed vehicles constraint for multi-depot pickups
    allowed_vehicles = {}
    for index, loc_id in enumerate(location_ids):
        # Ignore depots (they are starting/ending points for OR-Tools)
        if loc_id.startswith("D"):
            continue

        # Find orders delivering to this location
        matching_orders = [o for o in orders if o.delivery_location == loc_id]
        if not matching_orders:
            continue

        pickups = {o.pickup_location for o in matching_orders}

        # Find vehicles starting at these pickup depots
        allowed_indices = []
        for v_idx, vehicle in enumerate(vehicles):
            if vehicle.current_location in pickups:
                allowed_indices.append(v_idx)

        # Only restrict if there are valid allowed vehicles (default is all allowed)
        if allowed_indices:
            allowed_vehicles[index] = allowed_indices

    return {
        "location_ids": location_ids,
        "distance_matrix": distance_matrix,
        "demands": demands,
        "priorities": priorities,
        "vehicle_capacities": vehicle_capacities,
        "starts": starts,
        "ends": ends,
        "allowed_vehicles": allowed_vehicles
    }


def prepare_traffic_data(location_ids, distance_matrix, active_incidents):
    """
    Translate traffic incidents with location codes (e.g. D2, L04)
    into node indices and apply them to build the traffic adjusted matrix.
    """
    traffic_events = {}
    blocked_edges = []

    for incident in active_incidents:
        from_code = incident.from_location
        to_code = incident.to_location
        if from_code in location_ids and to_code in location_ids:
            from_idx = location_ids.index(from_code)
            to_idx = location_ids.index(to_code)

            traffic_events[(from_idx, to_idx)] = {
                "level": incident.level
            }
            # Bidirectional incident
            traffic_events[(to_idx, from_idx)] = {
                "level": incident.level
            }

            if incident.level in ["closure", "blocked"]:
                blocked_edges.append((from_idx, to_idx))
                blocked_edges.append((to_idx, from_idx))

    traffic_matrix = apply_traffic(distance_matrix, traffic_events)

    # Return translated raw events for explanation tracking in the optimizer
    traffic_events_raw = {}
    for incident in active_incidents:
        traffic_events_raw[(incident.from_location, incident.to_location)] = {
            "level": incident.level
        }

    return {
        "traffic_matrix": traffic_matrix,
        "blocked_edges": blocked_edges,
        "traffic_events_raw": traffic_events_raw
    }