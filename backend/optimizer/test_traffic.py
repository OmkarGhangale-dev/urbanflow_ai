from optimizer.matrix import (
    build_distance_matrix
)

from optimizer.traffic import (
    apply_traffic
)


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


print("NORMAL DISTANCE")

for row in distance_matrix:
    print(row)


# Simulate heavy traffic
# between D2 and L04
#
# D2 = index 1
# L04 = index 5

traffic_events = {

    (1, 5): {
        "level": "heavy",
        "multiplier": 3.0
    }

}


traffic_matrix = apply_traffic(
    distance_matrix,
    traffic_events
)


print("\nTRAFFIC ADJUSTED DISTANCE")

for row in traffic_matrix:
    print(row)