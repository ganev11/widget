# Fixtures API Documentation

The `/fixtures` endpoint is the central hub for retrieving sports match data. While a standard request returns core match details (teams, time, score), you can use the `include` parameter to enrich the response with deep analytical and market data.

## Endpoint
`GET /fixtures`

## Query Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `sport_id` | `integer` | The ID of the sport. Defaults to `1` (Football/Soccer). |
| `league_id` | `string` | Comma-separated list of league IDs (e.g., `12,45`). |
| `fixture_id` | `string` | Comma-separated list of specific fixture IDs. |
| `date` | `string` | Date in `DD-MM-YYYY` format. |
| `is_live` | `boolean` | Set to `true` to filter for currently active matches. |
| `language`| `string` | Localization code for names (default: `en`). |
| **`include`** | `string` | Comma-separated list of data modules to expand. |

---

## The `include` Parameter

Use the `include` parameter to customize the data payload. This allows you to fetch exactly what you need in a single request.

### Supported Includes

| Value | Description |
| :--- | :--- |
| **`odds`** | Injects betting odds from available bookmakers into each fixture object. |
| **`statistics`** | Adds match statistics (e.g., attacks, shots on goal, possession). Returns live data if the match is in progress. |
| **`metrics`** | Adds advanced algorithmic metrics and calculated performance indicators for the fixture. |
| **`fair_odds`** | Adds "Fair Value" pricing. This calculates what the odds should be based on statistical models, helping identify value in the market. |
| **`movement`** | Includes historical odds movement data, showing how the market lines have changed over time. |
| **`seasons`** | Returns a list of available seasons for the requested league (best used when filtering by a single `league_id`). |

---

## Examples

### 1. Match Day Overview with Odds
Retrieve all matches for a specific date with current betting market data:
`GET /fixtures?date=25-10-2024&include=odds`

### 2. Live Match Analysis
Get live matches with real-time statistics to track performance:
`GET /fixtures?is_live=true&include=statistics`

### 3. Deep Analytical View
Get a specific fixture with advanced metrics, fair value calculations, and market movement:
`GET /fixtures?fixture_id=88421&include=metrics,fair_odds,movement`

### 4. League Preparation
Get fixtures for a league along with the list of available historical seasons:
`GET /fixtures?league_id=120&include=seasons`

---

## Data Structure Notes

- **Response Format:** The API returns a JSON object. The primary data is contained within the `fixtures` array.
- **Dynamic Arrays:** The `fixtures` property is always returned as an array, even if a single `fixture_id` is requested.
- **Language Support:** Localization applies to team names and league names where available via the `lang` parameter.

---

This section describes the standard **Fixture Object** returned by the `/fixtures` endpoint. This base structure is always present in the response, even without additional parameters.

## The Fixture Object

Every item in the `fixtures` array follows the schema below. Note that **scores** and **periods** are included by default in every response.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `integer` | Unique identifier for the fixture. |
| `date_time` | `string` | The scheduled start time of the match (UTC). |
| `status` | `string` | The current state of the match (e.g., `NOT_STARTED`, `INPLAY_1ST_HALF`, `HT`, `FT`). |
| `is_live` | `boolean` | Returns `true` if the match is currently in progress (calculated based on status). |
| `language` | `string` | The language code used for the names in the response. |
| `sport` | `object` | Contains the `id` and `name` of the sport. |
| `country` | `object` | Details about the country where the league is based. |
| `league` | `object` | Details about the competition, including its hierarchy level. |
| `season` | `object` | The specific season the fixture belongs to. |
| `participants` | `array` | An array containing the two competing teams (Home and Away). |
| `scores` | `array` | List of score entries for the match. *(Detailed documentation coming soon)* |
| `periods` | `array` | Breakdown of match periods and sub-scores. *(Detailed documentation coming soon)* |

---

### Object Definitions

#### Country
```json
"country": {
    "id": 42,
    "name": "England",
    "alpha3": "GBR"
}
```

#### League
```json
"league": {
    "id": 8,
    "name": "Premier League",
    "level": 1
}
```

#### Participants
Each fixture contains exactly two participants.
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `integer` | Unique identifier for the team. |
| `name` | `string` | The name of the participant. |
| `position` | `integer` | The current league table position (if available). |
| `location` | `string` | Either `home` or `away`. |

---

## Example Base Response
`GET /fixtures?fixture_id=123`

```json
{
  "fixtures": [
    {
      "id": 123,
      "date_time": "2024-10-25T19:45:00.000Z",
      "status": "INPLAY_1ST_HALF",
      "is_live": true,
      "language": "en",
      "sport": {
        "id": 1,
        "name": "Football"
      },
      "country": {
        "id": 42,
        "name": "England",
        "alpha3": "GBR"
      },
      "league": {
        "id": 8,
        "name": "Premier League",
        "level": 1
      },
      "season": {
        "id": 21024,
        "name": "2024/2025"
      },
      "participants": [
        {
          "id": 1,
          "name": "Manchester United",
          "position": 5,
          "location": "home"
        },
        {
          "id": 2,
          "name": "Liverpool",
          "position": 2,
          "location": "away"
        }
      ],
      "scores": [],
      "periods": []
    }
  ]
}
```

> **Note:** If no score or period data is currently available for a fixture, these fields will return as empty arrays `[]`. Advanced data like **statistics** or **odds** are only appended when using the `include` parameter.