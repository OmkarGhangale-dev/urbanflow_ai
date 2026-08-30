import json
from pathlib import Path
from optimizer.distance import haversine_distance


DATA_FILE = Path(__file__).parent.parent / "data" / "locations.json"


def load_locations():
    with open(DATA_FILE, "r") as file:
        return json.load(file)


def build_distance_matrix(location_ids):

    locations = load_locations()

    matrix = []

    for source_id in location_ids:

        source = locations[source_id]

        row = []

        for destination_id in location_ids:

            destination = locations[destination_id]

            distance = haversine_distance(
                source["latitude"],
                source["longitude"],
                destination["latitude"],
                destination["longitude"]
            )

            row.append(round(distance, 2))

        matrix.append(row)

    return matrix