from database import SessionLocal
from optimizer.route_service import prepare_optimization_data


db = SessionLocal()

try:
    vehicles, orders = prepare_optimization_data(db)

    print("\nVEHICLES:")

    for vehicle in vehicles:
        print(
            vehicle.vehicle_code,
            "| Capacity:",
            vehicle.capacity,
            "| Location:",
            vehicle.current_location
        )

    print("\nORDERS:")

    for order in orders:
        print(
            order.order_code,
            "| Weight:",
            order.weight,
            "| Priority:",
            order.priority,
            "| From:",
            order.pickup_location,
            "| To:",
            order.delivery_location
        )

finally:
    db.close()