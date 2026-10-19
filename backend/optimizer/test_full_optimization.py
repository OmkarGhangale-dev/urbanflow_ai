from database import SessionLocal

from optimizer.route_service import prepare_optimization_data
from optimizer.optimization_data import prepare_route_data
from optimizer.vrp_engine import optimize_routes


db = SessionLocal()

try:
    # --------------------------------
    # 1. Get data from database
    # --------------------------------

    vehicles, orders = prepare_optimization_data(db)

    if not vehicles:
        print("No available vehicles found.")
        exit()

    if not orders:
        print("No pending orders found.")
        exit()

    # --------------------------------
    # 2. Convert database data
    # --------------------------------

    route_data = prepare_route_data(
        vehicles,
        orders
    )

    print("\n===== URBANFLOW INPUT =====")

    print(
        "Locations:",
        route_data["location_ids"]
    )

    print(
        "Demands:",
        route_data["demands"]
    )

    print(
        "Vehicle Capacities:",
        route_data["vehicle_capacities"]
    )
    print("\nDistance Matrix used by FULL optimizer:")

    for row in route_data["distance_matrix"]:
        print(row)
        
    print(
        "Priorities:",
        route_data["priorities"]
    )

    print(
    "Vehicle Starts:",
    route_data["starts"]
    )

    print(
    "Vehicle Ends:",
    route_data["ends"]
    )

    # --------------------------------
    # 3. Run OR-Tools
    # --------------------------------

    result = optimize_routes(
    distance_matrix=route_data["distance_matrix"],
    demands=route_data["demands"],
    vehicle_capacities=route_data["vehicle_capacities"],
    starts=route_data["starts"],
    ends=route_data["ends"],
    priorities=route_data["priorities"]
    )

    # --------------------------------
    # 4. Display result
    # --------------------------------

    print("\n===== URBANFLOW OPTIMIZATION =====")

    print("Status:", result["status"])

    for route in result["routes"]:

        vehicle_id = route["vehicle_id"]

        vehicle = vehicles[vehicle_id]

        print(
            f"\nVehicle: {vehicle.vehicle_code}"
        )

        print(
            "Route:",
            route["route"]
        )

        print(
            "Distance:",
            route["distance_km"],
            "km"
        )

        print(
            "Load:",
            route["load"],
            "/",
            vehicle.capacity
        )

finally:
    db.close()