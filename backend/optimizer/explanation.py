def generate_route_explanation(
    vehicle_code: str,
    route_length: int,
    load: float,
    capacity: float,
    priorities_served: list,
    traffic_impact: str,
    score: float,
    critical_locations: list = None,
    high_locations: list = None
) -> str:
    """
    Generate a dynamic natural language explanation for why a route was selected.
    """
    util_pct = (load / capacity) * 100 if capacity > 0 else 0
    stops_count = route_length - 2  # exclude start & end depots

    if stops_count <= 0:
        return f"Vehicle {vehicle_code} is idle at depot. Fleet capacity is sufficient and other vehicles provide lower overall distance cost."

    parts = []

    # 1. Priorities
    if critical_locations:
        locs_str = ", ".join(critical_locations)
        parts.append(f"prioritizes time-critical delivery at {locs_str} to meet tight delivery SLA")
    elif high_locations:
        locs_str = ", ".join(high_locations)
        parts.append(f"prioritizes high-priority delivery at {locs_str} over normal deliveries")
    else:
        parts.append("services normal-priority deliveries in spatial proximity order")

    # 2. Utilization
    if util_pct >= 75:
        parts.append(f"maximizes cargo consolidation with a high capacity utilization of {util_pct:.1f}%")
    elif util_pct >= 40:
        parts.append(f"maintains a balanced capacity utilization of {util_pct:.1f}%")
    else:
        parts.append(f"runs with a light load ({util_pct:.1f}%) to ensure fast dispatch")

    # 3. Traffic
    if traffic_impact in ["severe", "blocked"]:
        parts.append("reroutes around gridlock sectors to bypass major delays")
    elif traffic_impact == "heavy":
        parts.append("adjusts paths to avoid heavy traffic zones")
    elif traffic_impact == "moderate":
        parts.append("utilizes secondary roads to minimize moderate congestion delays")
    else:
        parts.append("takes the mathematically shortest haversine paths under clear conditions")

    explanation = f"Route selected for {vehicle_code}: It {parts[0]}, {parts[1]}, and {parts[2]}."
    return explanation


def generate_reroute_explanation(
    vehicle_code: str,
    old_route: list,
    new_route: list,
    old_distance: float,
    new_distance: float,
    affected_orders: list,
    incident_type: str = "heavy traffic"
) -> str:
    """
    Generate an explanation of why a route was dynamically changed.
    """
    dist_diff = new_distance - old_distance
    orders_str = ", ".join(affected_orders) if affected_orders else "pending orders"

    if dist_diff > 0:
        explanation = (
            f"UrbanFlow AI detected a {incident_type} incident on the route of {vehicle_code}. "
            f"To bypass congestion, the vehicle was rerouted. Although this adds {dist_diff:.2f} km of travel distance, "
            f"it avoids severe traffic delays, ensuring orders ({orders_str}) are delivered on time."
        )
    else:
        explanation = (
            f"Dynamic re-optimization triggered by a {incident_type} incident on the route of {vehicle_code}. "
            f"UrbanFlow AI calculated an alternate path that avoids the congested links. The new route is "
            f"efficient and maintains order SLAs for ({orders_str})."
        )
    return explanation
