## Odds

```json
{
    "odd_id": 72230784,
    "fixture_id": 945434,
    "market_id": 3,
    "bookmaker_id": 2,
    "is_live": 0,
    "label_id": 2,
    "value": 1.9,
    "handicap": 2.25,
    "line": 2.25,
    "last_update": 1767527587,
    "suspend": 0,
    "sp": 1.725,
    "home_score": 0,
    "away_score": 0,
    "status": 0,
    "raw": {}
}
```

## Market codes

This table maps market_id and their labels.

| market_id | Market | label_id |
|---:|---|---|
| 1 | 3Way result — Moneyline - 1x2 | 1 Home, 2 Away, 0 Draw
| 2 | Asian handicap + Alternative Asian handicap | 1 Home, 2 Away
| 3 | Goal line + Alternative Goal line | 1 Under, 2 Over
| 4 | Match Goals (European style) + Alternative Match Goals | 1 Under, 2 Over
| 5 | Corners — Asian Handicap | 1 Home, 2 Away
| 6 | Asian Total Corners | 1 Under, 2 Over
| 7 | Correct Score | 1 + home score + away score. 100 - 0:0, 111 - 1:1, 142 - 4:2 etc.
| 11 | 1st Half 3Way result — Moneyline - 1x2 | 1 Home, 2 Away, 0 Draw
| 12 | 1st Half Asian handicap + Alternative Asian handicap | 1 Home, 2 Away
| 13 | 1st Half Goal line + Alternative Goal line | 1 Under, 2 Over
| 16 | 1st Half Asian Total Corners | 1 Under, 2 Over
| 17 | 1st Half Correct Score | 1 + home score + away score. 100 - 0:0, 111 - 1:1, 142 - 4:2 etc.
| 22 | n-Goal — Next goal | 1 Home, 2 Away, 0 Draw. n-Goal is stored in line property. line 1 - 1st goal, 2 - 2nd, etc.
| 50 | Draw no bet | 1 Home, 2 Away
| 51 | HT/FT | 111 1/1, 110 1/X, 112 1/2, 101 X/1, 100 X/X, 102 X2, 121 2/1, 120 2/X, 122 2/2
| 52 | Odd/Even | 1 Odd, 2 Even
| 53 | BTTS (Both Teams To Score) | 1 Yes, 2 No
| 54 | 1st Half BTTS | 1 Yes, 2 No
| 55 | 2nd Half BTTS | 1 Yes, 2 No
| 56 | Team Corners | 11 Home Under, 12 Home Over, 21 Away Under, 22 Away Over
| 57 | Team Total Goals | 11 Home Under, 12 Home Over, 21 Away Under, 22 Away Over
| 58 | Double chance | 2 Draw/Away, 10 Home/Draw, 12 Home/Away
| 59 | Clean Sheet | 11 Home Yes, 12 Home No, 21 Away Yes, 22 Away No
| 203 | Asian Total Cards | 1 Under, 2 Over

## Bookmakers

Odds are only for reference.

| bookmaker_id | Description |
|---:|---|
| 2 | European style soft bookmakers averages |
| 3 | Asian style bookmakers |

### European vs Asian Goal Lines (Simple)

**Asian goal line**
- Uses **0.25 steps** (1.0, 1.25, 1.75)
- Can be **half win / half loss**
- Lines stay close to the **main line**
- Odds are usually **near even**

**European goal line**
- Uses **half goals only** (0.5, 1.5, 2.5)
- **Win or lose only**, no half results
- Can offer lines **far from the main line**
- Allows **much higher odds**

**Example**
- Score 0–0  
- Asian: near main line  
- European: over 5.5 possible with very high odds

**Note**
- Same line (e.g. over 2.5) can have **different odds** in Asian vs European markets


## Status

| Status | Description |
|---:|---|
| -3 | Void |
| -2 | Half Lost |
| -1 | Lost |
| 0 | Pending |
| 1 | Won |
| 2 | Half Won |

## Fair Odds

```json
{
    "market_id": 4,
    "label_id": 1,
    "probability": 20.07,
    "value": 4.984,
    "handicap": 1.5,
    "line": 1.5
}
```
