from optimizer.matrix import build_distance_matrix


locations = [
    "D1",
    "D2",
    "L01",
    "L02",
    "L03",
    "L04"
]


matrix = build_distance_matrix(locations)


print("Locations:")
print(locations)

print("\nDistance Matrix (km):")

for row in matrix:
    print(row)