**Insights**

Endpoint
- `GET /insights/get`

Authentication
- [Authentication](authentication.md)

Query Parameters
- `market_id` (optional): comma-separated list of [markets](markets.md) IDs to filter bets, e.g. `market_id=1,3`.
- `status` (optional): comma-separated list of insight [statuses](statuses.md).
- `is_live` (optional): `is_live=1` filter only events that are live now. default 0 (show all insights).
- `expired` (optional): `expired=1` include expired insights (content is outdate). default 0 (show only valid). Can be used for sync your backend.
- `league_id` (optional): comma-separated list of league IDs to filter insights. See [regions](regions.md) endpoint documentation.
- `fixture_id` (optional): single fixture ID to restrict results to a fixture.
- ~~`league_level` (optional): numeric league level to filter by. Not implemented yet!~~
- ~~`integration` (optional): integration name or numeric id used to filter bets by integration. Not implemented yet!~~
- `language` (optional): [language](languages.md) code (default: `en`). 
- ~~`time_from` / `time_to` (optional): ISO datetimes to restrict insights by `date_time`. Not tested enough!~~
- `value_from` / `value_to` (optional): numeric range to filter bets' `value`.
- `limit` (optional): max number of insights to return (default: `100`, max `1000`). This may be change depending on data included with insights.

Default `status`:
```
[
  'INPLAY_1ST_HALF',
  'INPLAY_2ND_HALF',
  'INPLAY_ET',
  'INPLAY_PENALTIES',
  'HT',
  'EXTRA_TIME_BREAK',
  'PEN_BREAK',
  'NOT_STARTED'
]
```

Response
- `200 OK` with JSON array of insight objects. Empty array if no results. Each insight object has default fixture object (participants, scores, periods, etc...) `TODO Add documentation for fixture object!` and insight in following shape:

```json
"insights": [
    {
        "id": 4310, // Internal insight identifier.
        "user_id": 5, // Internal user identifier.
        "model_id": 8, // Internal model identifier.
        "job_id": 8508, // Internal job identifier.
        "market_id": 3, // Market identifier. See [markets](markets.md) for details.
        "value": 3.8, // Odd value (decimal).
        "suspend": 0, // 1 if odd is suspended, 0 otherwise.
        "sp": 1.75, // Starting price (decimal). This is the odd at the moment the bet was placed and is used for profit calculation.
        "created_at": "2026-01-10T15:33:37.900Z",
        "language": "en",
        "content": {
            "text": "OVER 2.5 is the clear outcome as both Ayr United and Airdrieonians showcase strong attacking form and defensive vulnerabilities."
        },
        "bet": {
            "odd_id": 73060313, // Internal odd identifier.
            "market_id": 3,
            "bookmaker_id": 4,
            "is_live": 1,
            "label_id": 2,
            "value": 3.8,
            "handicap": 2.5,
            "line": 2.5,
            "last_update": 1768063249,
            "suspend": 0,
            "sp": 1.93,
            "home_score": 0,
            "away_score": 0,
            "status": 0, // Odd status. 0 - pending
            "raw": { // Holds external data for deep integration
                "event_id": 13936816,
                "market_id": 1339290698,
                "selection_id": 3314639099,
                "market_type_id": 18,
                "selection_type_id": 12
            }
        }
    }
]
```

**Bet**
- "odd_id": 73060313 - Internal odd identifier.
- "market_id": 3 - Market identifier. See [markets](markets.md) for details.
- "bookmaker_id": 4 - Bookmaker identifier. See [bookmakers](markets.md#bookmakers) for details.
- "is_live": 1 - 1 if odd is for live event, 0 otherwise.
- "label_id": 2 - Label identifier. See [markets](markets.md) for details.
- "value": 3.8 - Odd value (decimal).
- "handicap": 2.5 - Handicap value.
- "line": 2.5 - Line value.
- "last_update": 1768063249 - Last update timestamp (unix).
- "suspend": 0 - 1 if odd is suspended, 0 otherwise.
- "sp": 1.93 - Starting price (decimal). This is the first odd we saw for this odd.
- "home_score": 0 - For internal use.
- "away_score": 0 - For internal use.
- "status": 0 - See [odds status](markets.md#status)

