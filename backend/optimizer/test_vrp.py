from optimizer.vrp_engine import optimize_routes


# Locations:
#
# 0 = Depot
# 1 = L01
# 2 = L02
# 3 = L03
# 4 = L04

distance_matrix = [
    [0, 4, 6, 8, 10],
    [4, 0, 3, 7, 9],
    [6, 3, 0, 5, 7],
    [8, 7, 5, 0, 4],
    [10, 9, 7, 4, 0]
]


# Delivery demand at each location
demands = [
    0,
    20,
    30,
    15,
    40
]


# Two vehicles
vehicle_capacities = [
    60,
    80
]

starts = [0, 0]
ends = [0, 0]

result = optimize_routes(
    distance_matrix=distance_matrix,
    demands=demands,
    vehicle_capacities=vehicle_capacities,
    starts=starts,
    ends=ends
)


print(result)