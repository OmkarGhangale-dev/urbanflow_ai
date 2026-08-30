from pydantic import BaseModel


# -------------------------
# VEHICLE SCHEMAS
# -------------------------

class VehicleCreate(BaseModel):
    vehicle_code: str
    capacity: float
    current_location: str
    fuel_level: float
    status: str = "available"


class VehicleResponse(VehicleCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------------
# ORDER SCHEMAS
# -------------------------

class OrderCreate(BaseModel):
    order_code: str
    pickup_location: str
    delivery_location: str
    weight: float
    priority: str = "normal"
    time_window_start: str
    time_window_end: str
    status: str = "pending"


class OrderResponse(OrderCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------------
# TRAFFIC INCIDENT SCHEMAS
# -------------------------

class TrafficIncidentCreate(BaseModel):
    from_location: str
    to_location: str
    level: str = "normal"


class TrafficIncidentResponse(TrafficIncidentCreate):
    id: int

    class Config:
        from_attributes = True


# -------------------------
# OPTIMIZATION SCHEMAS
# -------------------------

class RouteScoreBreakdown(BaseModel):
    distance_cost: float
    traffic_cost: float
    priority_cost: float
    utilization_penalty: float


class RouteResponse(BaseModel):
    vehicle_code: str
    route: list[str]
    distance_km: float
    load: float
    capacity: float
    utilization_pct: float
    priorities_served: list[str]
    traffic_impact: str
    urbanflow_score: float
    score_breakdown: RouteScoreBreakdown
    optimization_reason: str


class GlobalMetrics(BaseModel):
    total_distance_km: float
    total_cost: float
    vehicles_used: int
    vehicles_available: int
    fleet_utilization_pct: float
    critical_orders_served: int
    traffic_affected_routes: int
    optimization_time_ms: float


class OptimizeResponse(BaseModel):
    status: str
    routes: list[RouteResponse]
    metrics: GlobalMetrics


# -------------------------
# RE-OPTIMIZATION SCHEMAS
# -------------------------

class RerouteChange(BaseModel):
    vehicle_code: str
    old_route: list[str]
    new_route: list[str]
    old_distance_km: float
    new_distance_km: float
    distance_change_km: float
    old_score: float
    new_score: float
    score_change: float
    affected_orders: list[str]
    reason: str


class GlobalMetricsChange(BaseModel):
    old_total_distance_km: float
    new_total_distance_km: float
    distance_change_km: float
    old_total_cost: float
    new_total_cost: float
    cost_change: float


class ReoptimizeResponse(BaseModel):
    status: str
    rerouted: bool
    changes: list[RerouteChange]
    global_metrics_change: GlobalMetricsChange
    routes: list[RouteResponse]
    metrics: GlobalMetrics