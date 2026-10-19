import random
from sqlalchemy.orm import Session
import models

# Standard locations from locations.json
DEPOTS = ["D1", "D2"]
DELIVERIES = ["L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08"]


def load_demo_scenario(db: Session):
    """
    Clear all records and load the default hackathon demo scenario.
    """
    # 1. Clear database
    db.query(models.Vehicle).delete()
    db.query(models.Order).delete()
    db.query(models.TrafficIncident).delete()
    db.commit()

    # 2. Add standard vehicles
    demo_vehicles = [
        models.Vehicle(
            vehicle_code="V01",
            capacity=100.0,
            current_location="D1",
            fuel_level=85.0,
            status="available"
        ),
        models.Vehicle(
            vehicle_code="V02",
            capacity=80.0,
            current_location="D1",
            fuel_level=72.0,
            status="available"
        ),
        models.Vehicle(
            vehicle_code="V03",
            capacity=120.0,
            current_location="D2",
            fuel_level=91.0,
            status="available"
        )
    ]

    # 3. Add standard orders
    demo_orders = [
        models.Order(
            order_code="O01",
            pickup_location="D1",
            delivery_location="L01",
            weight=20.0,
            priority="high",
            time_window_start="09:00",
            time_window_end="11:00",
            status="pending"
        ),
        models.Order(
            order_code="O02",
            pickup_location="D1",
            delivery_location="L02",
            weight=30.0,
            priority="normal",
            time_window_start="09:30",
            time_window_end="12:00",
            status="pending"
        ),
        models.Order(
            order_code="O03",
            pickup_location="D1",
            delivery_location="L03",
            weight=15.0,
            priority="critical",
            time_window_start="10:00",
            time_window_end="11:00",
            status="pending"
        ),
        models.Order(
            order_code="O04",
            pickup_location="D2",
            delivery_location="L04",
            weight=40.0,
            priority="normal",
            time_window_start="11:00",
            time_window_end="14:00",
            status="pending"
        ),
        models.Order(
            order_code="O05",
            pickup_location="D2",
            delivery_location="L07",
            weight=25.0,
            priority="high",
            time_window_start="10:00",
            time_window_end="12:00",
            status="pending"
        )
    ]

    for vehicle in demo_vehicles:
        db.add(vehicle)

    for order in demo_orders:
        db.add(order)

    db.commit()

    return {
        "status": "success",
        "message": "Demo scenario loaded successfully",
        "vehicles_seeded": len(demo_vehicles),
        "orders_seeded": len(demo_orders)
    }


def generate_random_scenario(db: Session, num_vehicles: int = 4, num_orders: int = 8):
    """
    Clear database and generate a random synthetic logistics scenario in Pune.
    """
    # 1. Clear database
    db.query(models.Vehicle).delete()
    db.query(models.Order).delete()
    db.query(models.TrafficIncident).delete()
    db.commit()

    # 2. Seed vehicles
    vehicles = []
    capacities = [60, 80, 100, 120, 150]
    for i in range(1, num_vehicles + 1):
        vehicle = models.Vehicle(
            vehicle_code=f"V{i:02d}",
            capacity=float(random.choice(capacities)),
            current_location=random.choice(DEPOTS),
            fuel_level=float(random.randint(60, 100)),
            status="available"
        )
        db.add(vehicle)
        vehicles.append(vehicle)

    # 3. Seed orders
    priorities = ["low", "normal", "high", "critical"]
    for i in range(1, num_orders + 1):
        delivery_loc = random.choice(DELIVERIES)
        # Select depot closest or just random depot as pickup
        pickup_loc = random.choice(DEPOTS)
        weight = float(random.randint(10, 45))
        priority = random.choice(priorities)

        h_start = random.randint(8, 14)
        h_end = h_start + random.randint(2, 4)

        order = models.Order(
            order_code=f"O{i:02d}",
            pickup_location=pickup_loc,
            delivery_location=delivery_loc,
            weight=weight,
            priority=priority,
            time_window_start=f"{h_start:02d}:00",
            time_window_end=f"{h_end:02d}:00",
            status="pending"
        )
        db.add(order)

    db.commit()

    return {
        "status": "success",
        "message": f"Generated synthetic scenario with {num_vehicles} vehicles and {num_orders} orders",
        "vehicles_seeded": num_vehicles,
        "orders_seeded": num_orders
    }
