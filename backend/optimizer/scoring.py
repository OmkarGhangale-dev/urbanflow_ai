def calculate_route_score(
    distance_km: float,
    traffic_delay_km: float,
    urgency_penalty: float,
    utilization_pct: float,
    weights: dict = None
):
    """
    Calculate the UrbanFlow multi-objective route score.
    Lower score = better route.

    Weights dictionary can configure the balance of:
    - distance: importance of absolute distance in km
    - traffic: importance of avoiding traffic delays
    - priority: importance of serving high-priority deliveries early
    - utilization: importance of high cargo load utilization (penalizes empty space)
    """
    if weights is None:
        weights = {
            "distance": 1.0,
            "traffic": 2.0,
            "priority": 10.0,
            "utilization": 5.0
        }

    w_dist = weights.get("distance", 1.0)
    w_traffic = weights.get("traffic", 2.0)
    w_priority = weights.get("priority", 10.0)
    w_util = weights.get("utilization", 5.0)

    # 1. Distance cost
    distance_cost = distance_km * w_dist

    # 2. Traffic cost
    traffic_cost = traffic_delay_km * w_traffic

    # 3. Priority delivery urgency penalty (accumulated arrival distance/time * priority)
    priority_cost = urgency_penalty * w_priority

    # 4. Utilization penalty (lower utilization -> higher penalty)
    utilization_penalty = (100.0 - utilization_pct) * w_util

    total_score = distance_cost + traffic_cost + priority_cost + utilization_penalty

    return {
        "total_score": round(total_score, 2),
        "breakdown": {
            "distance_cost": round(distance_cost, 2),
            "traffic_cost": round(traffic_cost, 2),
            "priority_cost": round(priority_cost, 2),
            "utilization_penalty": round(utilization_penalty, 2)
        }
    }