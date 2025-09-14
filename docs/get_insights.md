**Get Insights**

Summary
- Retrieve insights submitted to the insights system with optional filtering by market, league, fixture, integration, time and value ranges. Results include insight metadata and matching bets.

Endpoint
- `GET /get_insights`

Authentication
- Requires an authenticated user. The endpoint reads the current user from the request context and uses `user_id` when searching. Unauthenticated requests receive `403 Unauthorized`.

Query Parameters
- `market_id` (optional): comma-separated list of market IDs to filter bets, e.g. `market_id=1,3`.
- `status` (optional): comma-separated list of insight statuses (e.g. `NS`, `LIVE`, `HT`).
- `league_id` (optional): comma-separated list of league IDs to filter insights.
- `fixture_id` (optional): single fixture ID to restrict results to a fixture.
- `league_level` (optional): numeric league level to filter by.
- `integration` (optional): integration name or numeric id used to filter bets by integration.
- `lang` (optional): language code or name (default: `English`).
- `time_from` / `time_to` (optional): ISO datetimes to restrict insights by `date_time`.
- `time` (optional): shorthand `time=from,to` (comma-separated).
- `value_from` / `value_to` (optional): numeric range to filter bets' `value` (note: stored values are scaled internally).
- `value` (optional): shorthand `value=from,to` (comma-separated).
- `limit` (optional): max number of insights to return (default: `100`, max `1000`).

Examples
- Fetch insights for markets 1 and 3 in leagues 8 and 34, only STATUS `NS`:
```
GET /get_insights?market_id=1,3&league_id=8,34&status=NS
```

- Fetch insights in a time window and value range:
```
GET /get_insights?time_from=2025-07-27T00:00:00Z&time_to=2025-07-28T00:00:00Z&value_from=1.2&value_to=5.0
```

Response
- `200 OK` with JSON array of insight objects. Each insight object has the following shape:

```
{
  "insight_id": 123,
  "model_id": null,
  "sport_id": 1,
  "user_id": 42,
  "fixture_id": 98765,
  "lang": "English",
  "status": "NS",
  "fixture": { /* optional fixture JSON as stored */ },
  "insight": { /* insight payload as stored */ },
  "bets": [
    {
      "bet_id": 555,
      "market": "OVER_UNDER",
      "selection": "OVER",
      "line": 2.5,
      "confidence": 84,
      "market_id": 2,
      "label_id": 3,
      "odd_id": null,
      "value": 1.234,
      "sp": 1.234,
      "suspend": false,
      "in_play": false,
      "market_text": "Total goals in the match",
      "selection_text": "Over 3.5 goals in the match",
      "integration": "altenar",
      "raw_odd": { /* raw odd JSON if stored */ }
    }
  ],
  "date_time": "2025-07-27T12:34:56Z",
  "created_at": "2025-07-27T12:35:01Z"
}
```

Errors
- `403 Unauthorized` — request is not authenticated.
- `400 Bad Request` — invalid query parameter formats (e.g. non-numeric `league_id` values).
- `500 Internal Server Error` — unexpected server error during search.
