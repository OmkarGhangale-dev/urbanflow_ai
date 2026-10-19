def get_weights(
    traffic_level="normal",
    priority_level="normal",
    fleet_availability="normal"
):
    """
    Dynamically change optimization priorities
    according to current urban conditions.
    """

    weights = {
        "distance": 1.0,
        "traffic": 2.0,
        "priority": 10.0,
        "utilization": 5.0
    }

    # Heavy traffic
    if traffic_level == "high":
        weights["traffic"] = 6.0
        weights["distance"] = 0.5

    # Critical deliveries
    if priority_level == "critical":
        weights["priority"] = 25.0

    # Low fleet availability
    if fleet_availability == "low":
        weights["utilization"] = 12.0
        weights["distance"] = 1.5

    return weights