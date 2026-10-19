from optimizer.scoring import calculate_route_score
from optimizer.adaptive_weights import get_weights


# Same route properties
route = {
    "distance_km": 15.0,
    "traffic_delay_km": 2.0,
    "urgency_penalty": 10.0,
    "utilization_pct": 75.0
}


# Situation 1: Normal city conditions
normal_weights = get_weights(
    traffic_level="normal",
    priority_level="normal",
    fleet_availability="normal"
)

normal_score = calculate_route_score(
    **route,
    weights=normal_weights
)


# Situation 2: Heavy traffic + critical order
critical_weights = get_weights(
    traffic_level="high",
    priority_level="critical",
    fleet_availability="normal"
)

critical_score = calculate_route_score(
    **route,
    weights=critical_weights
)


print("Normal Situation Score:", normal_score)
print("Traffic + Critical Situation Score:", critical_score)

print("\nNormal Weights:")
print(normal_weights)

print("\nCritical Situation Weights:")
print(critical_weights)