def apply_traffic(
    distance_matrix,
    traffic_events
):
    """
    Apply traffic conditions to the distance matrix.

    Event types:

    normal
    heavy
    severe
    closure

    Example:

    {
        (1, 5): {
            "level": "closure"
        }
    }
    """

    traffic_matrix = [
        row.copy()
        for row in distance_matrix
    ]

    for (from_node, to_node), event in traffic_events.items():

        level = str(event.get("level", "normal")).lower()

        # --------------------------------
        # Multipliers
        # --------------------------------

        if level in ["closure", "blocked"]:
            multiplier = 1000000.0
        elif level == "severe":
            multiplier = 8.0
        elif level == "heavy":
            multiplier = 3.0
        elif level == "moderate":
            multiplier = 1.5
        else: # normal or other
            multiplier = 1.0

        traffic_matrix[from_node][to_node] = round(
            distance_matrix[from_node][to_node] * multiplier, 2
        )

        traffic_matrix[to_node][from_node] = round(
            distance_matrix[to_node][from_node] * multiplier, 2
        )

    return traffic_matrix