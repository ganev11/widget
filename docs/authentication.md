# Authentication

This API is secured using an **API Key** provided by **SSTrader**.

Your API key must be included in **every request**. Requests without a valid key will be rejected.

---

## API Key Formats (Supported)

You can authenticate using either:

1. **Bearer Token** (recommended)
2. **Query Parameter** (`api_key`)

---

## Bearer Token (Recommended)

Send the API key in the `Authorization` header as a Bearer token.

### Request Header

```http
Authorization: Bearer YOUR_API_KEY
```

## Query Parameter (api_key)

You can also pass the API key as a URL query parameter.

### Request URL

Production:
```http
https://api.sstrader.com/v1/endpoint?api_key=YOUR_API_KEY
```

Staging:
```http
https://dev.sstrader.com/v1/endpoint?api_key=YOUR_API_KEY
``` 