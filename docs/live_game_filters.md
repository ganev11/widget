# GET /live_game_filters

Endpoint: `/live_game_filters`

Method: `GET`

Summary
- Filters live (in-play) fixtures based on a selected period and one or more stat filters. The endpoint returns fixtures matching the provided filters and ordering.

Authentication
- Not documented here (skip auth/staff details as requested).

Query Parameters
- `filters` (required) — JSON string or object describing the filter criteria. See schema below.
- `orderBy` (optional) — can be provided inside `filters` or as a separate query parameter (JSON). Controls sorting.

Filters schema (JSON)

```
{
  "period": "LAST_10",           // required - see allowed period values
  "stats": {
    "xg1": {"op": ">", "value": 1},        // stat name -> operator + value
    "ont1": {"op": ">=", "value": 2},
    "xg_sum": {"op": ">", "value": 1.5}     // sum stat (home + away)
  },
  "orderBy": {"name":"xg1","direction":"ASC"}  // optional: single or array
}
```

Allowed `period` values
- `FT` — full time
- `HT` — half time
- `LAST_5` — last 5 minutes
- `LAST_10` — last 10 minutes
- `LAST_15` — last 15 minutes
- `LAST_20` — last 20 minutes
- `SH` — second half
- `LAST_GOAL` — from last goal
- `LAST_RED` — from last red card

Stats and naming
- Short stat names (home ends with `1`, away ends with `2`). For clarity each short name is paired with a longer human-friendly description:
  - `st1`, `st2` — Shots Total (home/away)
  - `ont1`, `ont2` — Shots On Target (home/away)
  - `offt1`, `offt2` — Shots Off Target (home/away)
  - `att1`, `att2` — Attacks (home/away)
  - `dan1`, `dan2` — Dangerous Attacks (home/away)
  - `cor1`, `cor2` — Corners (home/away)
  - `ft1`, `ft2` — Goals Scored (home/away)
  - `yc1`, `yc2` — Yellow Cards (home/away)
  - `psi1`, `psi2` — SStrader Index (home/away)
  - `xg1`, `xg2` — Expected Goals (home/away)

- Long, human-friendly names are also accepted and normalized. Examples of accepted long names (case-insensitive):
  - `SHOTS_TOTAL_HOME`, `SHOTS_TOTAL_AWAY`
  - `SHOTS_ON_TARGET_HOME`, `SHOTS_ON_TARGET_AWAY`
  - `SHOTS_OFF_TARGET_HOME`, `SHOTS_OFF_TARGET_AWAY`
  - `ATTACKS_HOME`, `ATTACKS_AWAY`
  - `DANGEROUS_ATTACKS_HOME`, `DANGEROUS_ATTACKS_AWAY`
  - `CORNERS_HOME`, `CORNERS_AWAY`
  - `GOALS_HOME`, `GOALS_AWAY`
  - `YELLOW_CARDS_HOME`, `YELLOW_CARDS_AWAY`
  - `SSTRADER_INDEX_HOME`, `SSTRADER_INDEX_AWAY`
  - `EXPECTED_GOALS_HOME`, `EXPECTED_GOALS_AWAY`

- Sum stats are supported by appending `_sum` to the short name or by using human-friendly sum names. Examples:
  - `xg_sum` or `EXPECTED_GOALS_SUM` — computed as `xg1 + xg2`
  - `st_sum` or `SHOTS_TOTAL_SUM` — computed as `st1 + st2`

Operators supported in each stat rule
- `>` , `>=` , `<` , `<=` , `=` (or `==`)
- `BETWEEN` — requires `min` and `max` (or `value`/`to` depending on client representation)

Ordering
- `orderBy` can be provided inside `filters` or as its own query param. Accepts a single object or an array:

```
{"name":"xg1","direction":"ASC"}
// or
[ {"name":"xg_sum","direction":"DESC"}, {"name":"xg1","direction":"ASC"} ]
```

- `name` accepts both short and human-readable stat names (e.g. `xg1` or `EXPECTED_GOALS_HOME`). The system normalizes names.
- `direction` must be `ASC` or `DESC` (case-insensitive).

Errors
- `400 Bad Request` — invalid `filters` JSON, missing `period`, or no stat filters provided.
- `502 Bad Gateway` — failure to fetch the upstream in-play data (external API error).
- `500 Internal Server Error` — unexpected server error.

Response
- `200 OK` — JSON object with a `fixtures` array. Each fixture is the raw fixture object fetched from the upstream in-play API and filtered by the criteria.

Example successful response (trimmed)

```
{
  "fixtures": [
    {
      "fixture_id": 2821841,
      "status": "LIVE",
      "m": 74,
      "localteam_id": 15591,
      "visitorteam_id": 15600,
      "LAST_10": { "xg1": 0.06, "xg2": 0.06, "att1": 8, "att2": 10 },
      "LAST_5": { "xg1": 0.02, "xg2": 0.01 }
    }
  ]
}
```

Examples

- Filter for fixtures where home expected goals in last 10 minutes (`xg1`) > 1 and order ascending by home xg:

URL-encoded GET example:

```
/live_game_filters?filters={"period":"LAST_10","stats":{"xg1":{"op":">","value":1}},"orderBy":{"name":"xg1","direction":"ASC"}}
```

- Curl example (recommended to URL-encode the filters value):

```bash
curl -G "https://your-host.example/live_game_filters" --data-urlencode "filters={\"period\":\"LAST_10\",\"stats\":{\"xg1\":{\"op\":\">\",\"value\":1}},\"orderBy\":{\"name\":\"xg1\",\"direction\":\"ASC\"}}"
```

- JavaScript fetch example:

```javascript
const filters = {
  period: 'LAST_10',
  stats: { xg1: { op: '>', value: 1 } },
  orderBy: { name: 'xg1', direction: 'ASC' }
};
const url = '/live_game_filters?filters=' + encodeURIComponent(JSON.stringify(filters));
const res = await fetch(url);
const data = await res.json();
console.log(data.fixtures);
```

Notes
- Stat names are case-insensitive and the endpoint accepts both short keys (`xg1`) and longer human-readable names (`EXPECTED_GOALS_HOME`).
- Sum stats (home + away) are computed server-side and can be used both in filters and as `orderBy` fields (e.g. `xg_sum`).
- The returned fixture objects are taken directly from the upstream in-play feed with minimal transformation — if you need a normalized fixture format, call the higher-level fixtures endpoints in the service.
