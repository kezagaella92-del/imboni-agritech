import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
OUTPUT_FILE = PROJECT_ROOT / "frontend" / "src" / "data" / "generatedSurveyData.json"

PRACTICE_COLUMNS = {
    "organicFert": ("organic_fertilizer.csv", "overall", 0),
    "inorganicFert": ("inorganic_fertilizer.csv", "overall", 0),
    "erosionControl": (
        "agricultural_practice_rates.csv",
        "farmers_who_protected_land_against_erosion_percent",
        1,
    ),
    "mechanization": (
        "agricultural_practice_rates.csv",
        "farmers_who_used_any_mechanical_equipment_for_agriculture_activities_percent",
        1,
    ),
    "irrigation": (
        "agricultural_practice_rates.csv",
        "farmers_who_practiced_irrigation_percent",
        1,
    ),
    "agroforestry": (
        "agricultural_practice_rates.csv",
        "farmers_who_practiced_agroforestry_percent",
        1,
    ),
}

CROP_COLUMNS = {
    "Bean": "Bean",
    "Banana": "Banana",
    "Cassava": "Cassava",
    "Sorghum": "Sorghum",
    "Maize": "Maize",
    "Cooking banana": "Cooking banana",
    "Sweet potato": "Sweet potato",
    "Irish potato": "Irish potato",
}

NATIONAL_PRACTICE_COLUMNS = {
    "improvedSeeds": (
        "improved_seed_use.csv",
        "percentage_of_farmers_who_used_improved_seeds",
        "unnamed:_3",
        "unnamed:_4",
        1,
    ),
    "organicFertilizer": ("organic_fertilizer.csv", "overall", "ssf", "lsf", 0),
    "inorganicFertilizer": ("inorganic_fertilizer.csv", "overall", "ssf", "lsf", 0),
    "pesticides": ("pesticide_use.csv", "overall", "ssf", "lsf", 1),
    "agroforestry": (
        "agricultural_practice_rates.csv",
        "farmers_who_practiced_agroforestry_percent",
        "unnamed:_12",
        "unnamed:_13",
        1,
    ),
    "irrigation": (
        "agricultural_practice_rates.csv",
        "farmers_who_practiced_irrigation_percent",
        "unnamed:_9",
        "unnamed:_10",
        1,
    ),
    "mechanization": (
        "agricultural_practice_rates.csv",
        "farmers_who_used_any_mechanical_equipment_for_agriculture_activities_percent",
        "unnamed:_6",
        "unnamed:_7",
        1,
    ),
}

SURVEY_METADATA = {
    "source": "NISR Seasonal Agricultural Survey",
    "season": "Season B 2026",
    "collectionStart": "April 19, 2026",
    "collectionEnd": "June 28, 2026",
    "period": "March 2026 – June 2026",
}


def read_csv(filename, header_rows_to_skip=0, rows_to_skip=0):
    path = PROCESSED_DIR / filename
    if not path.is_file():
        raise FileNotFoundError(f"Required processed survey file is missing: {path}")

    with path.open(encoding="utf-8-sig", newline="") as source:
        reader = csv.reader(source)
        for _ in range(header_rows_to_skip):
            next(reader, None)
        headers = next(reader, None)
        if not headers:
            raise ValueError(f"Processed survey file has no header row: {path}")
        for _ in range(rows_to_skip):
            next(reader, None)

        rows = []
        for values in reader:
            if not values or not values[0].strip():
                continue
            values += [""] * (len(headers) - len(values))
            rows.append(dict(zip(headers, values)))
        return rows


def required_number(row, column, filename):
    value = row.get(column, "").strip()
    if not value:
        raise ValueError(
            f"Missing value in {filename} for district "
            f"{row.get('District', row.get('district', 'unknown'))!r}, column {column!r}"
        )
    try:
        return float(value)
    except ValueError as error:
        raise ValueError(
            f"Invalid number {value!r} in {filename}, column {column!r}"
        ) from error


def number_or_zero(row, column, filename):
    value = row.get(column, "").strip()
    return 0 if not value else required_number(row, column, filename)


def district_name(row):
    value = row.get("District", row.get("district"))
    if value is None and row:
        value = next(iter(row.values()))
    return (value or "").strip()


def index_district_rows(rows, filename):
    result = {}
    for row in rows:
        name = district_name(row)
        if not name or name.casefold() in {"national", "rwanda", "total"}:
            continue
        if name in result:
            raise ValueError(f"Duplicate district {name!r} in {filename}")
        result[name] = row
    return result


def is_number(value):
    try:
        float(value)
        return True
    except (TypeError, ValueError):
        return False


def national_row(filename, header_rows_to_skip=0, rows_to_skip=0):
    rows = read_csv(
        filename,
        header_rows_to_skip=header_rows_to_skip,
        rows_to_skip=rows_to_skip,
    )
    for row in rows:
        if district_name(row).casefold() in {"national", "total"}:
            return row
    raise ValueError(f"National aggregate row is missing from {filename}")


def national_number(row, column, filename):
    value = row.get(column, "").strip()
    if not value:
        raise ValueError(f"National value is missing from {filename}, column {column!r}")
    return required_number(row, column, filename)


def main():
    national_land = national_row("agricultural_land.csv", header_rows_to_skip=1)
    overview = {
        "totalLand": round(
            national_number(national_land, "Total land area", "agricultural_land.csv") * 1000
        ),
        "agriculturalLand": round(
            national_number(national_land, "Agricultural land", "agricultural_land.csv") * 1000
        ),
        "agriculturalPercent": round(
            national_number(national_land, "% of agricultural land", "agricultural_land.csv"),
            1,
        ),
        "seasonalCropsLand": round(
            national_number(
                national_land, "Area under seasonal crops", "agricultural_land.csv"
            ) * 1000
        ),
        "permanentCropsLand": round(
            national_number(
                national_land, "Area under permanent crops", "agricultural_land.csv"
            ) * 1000
        ),
    }
    land_rows = index_district_rows(
        read_csv("agricultural_land.csv", header_rows_to_skip=1),
        "agricultural_land.csv",
    )
    land_rows = {
        name: row
        for name, row in land_rows.items()
        if is_number(row.get("Total land area", ""))
    }
    practice_rows = {
        metric: index_district_rows(
            read_csv(filename, rows_to_skip=skipped_rows),
            filename,
        )
        for metric, (filename, _, skipped_rows) in PRACTICE_COLUMNS.items()
    }
    crop_rows = index_district_rows(
        read_csv("cultivated_area.csv", header_rows_to_skip=1),
        "cultivated_area.csv",
    )

    crop_rows = index_district_rows(
        read_csv("cultivated_area.csv", header_rows_to_skip=1),
        "cultivated_area.csv",
    )

    districts = []
    for name, land in land_rows.items():
        district = {
            "totalLand": required_number(land, "Total land area", "agricultural_land.csv"),
            "agriLand": required_number(land, "Agricultural land", "agricultural_land.csv"),
            "agriPercent": required_number(
                land, "% of agricultural land", "agricultural_land.csv"
            ),
            "seasonalCrops": required_number(
                land, "Area under seasonal crops", "agricultural_land.csv"
            ),
            "permanentCrops": required_number(
                land, "Area under permanent crops", "agricultural_land.csv"
            ),
        }

        for metric, (filename, column, _) in PRACTICE_COLUMNS.items():
            rows = practice_rows[metric]
            row = rows.get(name)
            if row is None:
                raise ValueError(f"District {name!r} is missing from {filename}")
            district[metric] = required_number(row, column, filename)

        districts.append({"name": name, **district})

    if len(districts) != 30:
        raise ValueError(f"Expected 30 districts in agricultural_land.csv; found {len(districts)}")

    district_names = {district["name"] for district in districts}
    for metric, rows in practice_rows.items():
        missing = district_names - rows.keys()
        if missing:
            raise ValueError(
                f"Missing district data for {metric}: {', '.join(sorted(missing))}"
            )

    top_crops = []
    for name, column in CROP_COLUMNS.items():
        values = []
        for district in districts:
            row = crop_rows.get(district["name"])
            if row is None:
                raise ValueError(f"District {district['name']!r} is missing from cultivated_area.csv")
            values.append(number_or_zero(row, column, "cultivated_area.csv"))
        top_crops.append({"name": name, "area": round(sum(values)), "unit": "ha"})
    top_crops.sort(key=lambda crop: crop["area"], reverse=True)

    farming_practices = {}
    for key, (filename, overall_column, ssf_column, lsf_column, rows_to_skip) in (
        NATIONAL_PRACTICE_COLUMNS.items()
    ):
        row = national_row(filename, rows_to_skip=rows_to_skip)
        practice = {
            "overall": national_number(row, overall_column, filename),
            "ssf": national_number(row, ssf_column, filename),
        }
        lsf = row.get(lsf_column, "").strip()
        if lsf:
            practice["lsf"] = national_number(row, lsf_column, filename)
        farming_practices[key] = practice

    payload = {
        "survey": SURVEY_METADATA,
        "overview": overview,
        "farmingPractices": farming_practices,
        "districts": districts,
        "topCrops": top_crops,
    }
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Exported {len(districts)} districts to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
