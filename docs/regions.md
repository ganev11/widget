**Regions**

This endpoint retrieves a list of regions and leagues available in the system.

Endpoint
- `GET /regions`

Authentication
- [Authentication](authentication.md)

Query Parameters
- `status` (optional): filter leagues by their status. Possible values:
  - `upcoming`: leagues with upcoming fixtures.
  - `all`: leagues that are covered by us.
  - (if omitted, all leagues are returned) 
- `language` (optional): [language](languages.md) code (default: `en`). 

Response
- `200 OK` with JSON array of region objects. Each region object contains a list of league objects in the following shape:

```json
{
  "regions": [
    {
      "region": {
        "id": 6,
        "name": "International"
      },
      "country": {
        "id": 244,
        "name": "Africa",
        "alpha3": "" // ISO Alpha-3 country code
      },
      "league": {
        "id": 381,
        "name": "CAF Champions League"
      },
      "sport": {
        "id": 1,
        "name": "Football"
      },
      "count": 8, // Number of upcoming fixtures in this league.
      "live": 0, // Number of live fixtures in this league.
      "popular": false, // Whether this league is marked as popular.
      "level": 3 // League level (1 = top tier, 2 = second tier, etc.)
    }
  ]
}
```