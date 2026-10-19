from sqlalchemy import Column, Integer, String, Float
from database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_code = Column(String, unique=True, index=True)
    capacity = Column(Float)
    current_location = Column(String)
    fuel_level = Column(Float)
    status = Column(String)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(String, unique=True, index=True)
    title = Column(String, nullable=True)
    category = Column(String, nullable=True)
    pickup_location = Column(String)
    delivery_location = Column(String)
    weight = Column(Float)
    priority = Column(String)
    time_window_start = Column(String, nullable=True)
    time_window_end = Column(String, nullable=True)
    status = Column(String, default="pending")
    payment_status = Column(String, default="Prepaid")
    is_deleted_from_dashboard = Column(Integer, default=0)
    driver_name = Column(String, nullable=True)
    departure_date = Column(String, nullable=True)
    arrival_date = Column(String, nullable=True)


class TrafficIncident(Base):
    __tablename__ = "traffic_incidents"

    id = Column(Integer, primary_key=True, index=True)
    from_location = Column(String, index=True)
    to_location = Column(String, index=True)
    level = Column(String)  # normal, moderate, heavy, severe, blocked