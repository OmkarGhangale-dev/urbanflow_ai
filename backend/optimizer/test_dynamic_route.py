from optimizer.matrix import build_distance_matrix
from optimizer.traffic import apply_traffic
from optimizer.vrp_engine import optimize_routes


# ---------------------------------------
# INPUT
# ---------------------------------------

locations = [
    "D1",
    "D2",
    "L01",
    "L02",
    "L03",
    "L04"
]

distance_matrix = build_distance_matrix(
    locations
)

demands = [
    0,    # D1
    0,    # D2
    20,   # L01
    30,   # L02
    15,   # L03
    40    # L04
]

vehicle_capacities = [
    100,
    80,
    120
]

priorities = [
    0,
    0,
    4,
    2,
    8,
    2
]

starts = [
    0,
    0,
    1
]

ends = [
    0,
    0,
    1
]


# ---------------------------------------
# NORMAL OPTIMIZATION
# ---------------------------------------

normal_result = optimize_routes(
    distance_matrix,
    demands,
    vehicle_capacities,
    starts,
    ends,
    priorities=priorities
)

print("\n========== NORMAL ROUTE ==========")

for route in normal_result["routes"]:

    print(
        f"Vehicle V{route['vehicle_id'] + 1}: "
        f"{route['route']} | "
        f"Distance: {route['distance_km']} km | "
        f"Load: {route['load']}"
    )


# ---------------------------------------
# TRAFFIC INCIDENT
# ---------------------------------------

traffic_events = {

    # ROAD CLOSURE between D2 and L04
    (1, 5): {
        "level": "closure",
    }

}
blocked_edges = [
    (1, 5),
    (5, 1)
]


traffic_matrix = apply_traffic(
    distance_matrix,
    traffic_events
)


# ---------------------------------------
# DYNAMIC RE-OPTIMIZATION
# ---------------------------------------

dynamic_result = optimize_routes(
    distance_matrix,
    demands,
    vehicle_capacities,
    starts,
    ends,
    priorities=priorities,
    traffic_matrix=traffic_matrix,
    blocked_edges=blocked_edges
)

print("\n========== AFTER TRAFFIC INCIDENT ==========")

for route in dynamic_result["routes"]:

    print(
        f"Vehicle V{route['vehicle_id'] + 1}: "
        f"{route['route']} | "
        f"Distance/Cost: {route['distance_km']} km | "
        f"Load: {route['load']}"
    )