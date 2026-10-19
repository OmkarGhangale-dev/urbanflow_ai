from sqlalchemy.orm import Session

import models
from optimizer.vrp_engine import optimize_routes


def get_available_vehicles(db: Session):
    return (
        db.query(models.Vehicle)
        .filter(models.Vehicle.status == "available")
        .all()
    )


def get_pending_orders(db: Session):
    return (
        db.query(models.Order)
        .filter(models.Order.status == "pending")
        .all()
    )


def prepare_optimization_data(db: Session):

    vehicles = get_available_vehicles(db)
    orders = get_pending_orders(db)

    print(f"Available vehicles: {len(vehicles)}")
    print(f"Pending orders: {len(orders)}")

    return vehicles, orders