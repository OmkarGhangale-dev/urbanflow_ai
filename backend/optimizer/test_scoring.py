from optimizer.scoring import calculate_route_score


route_a = calculate_route_score(
    distance_km=15.0,
    traffic_delay_km=2.0,
    urgency_penalty=0.0,
    utilization_pct=80.0
)


route_b = calculate_route_score(
    distance_km=12.0,
    traffic_delay_km=5.0,
    urgency_penalty=30.0,
    utilization_pct=50.0
)


print("Route A Score Details:", route_a)
print("Route B Score Details:", route_b)

score_a = route_a["total_score"]
score_b = route_b["total_score"]

print(f"Route A Total Score: {score_a}")
print(f"Route B Total Score: {score_b}")

if score_a < score_b:
    print("UrbanFlow Recommendation: Route A (Lower score is better)")
else:
    print("UrbanFlow Recommendation: Route B (Lower score is better)")