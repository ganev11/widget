# Widget API Documentation

## Overview
The Widget API provides a streaming chat completion endpoint for integrating conversational AI into your application. This documentation describes the usage of the API and the expected request/response format.

---

## Endpoint
**POST** `/api/v1/chat/completions`

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <YOUR_API_KEY>`

### Request Body
```
{
  "model": "<model_name>",
  "messages": [
    { "role": "user", "content": "<your question>" },
  ],
  "previous_response_id": null,
  "stream": true,
  "metadata": { /* optional */ }
}
```
- `model`: The model to use for completion.
- `messages`: Array of message objects (role: 'user', 'assistant', etc.).
- `previous_response_id`: Id of the last conversation (resp_abcd1234 or null if this is your first question)
- `stream`: Set to `true` to enable Server-Sent Events (SSE) streaming.
- `metadata`: Optional metadata to send with the request.

---

## Authorization
Use the `Authorization` header:
```
Authorization: Bearer <YOUR_API_KEY>
```

---

## Streaming Response
The response is streamed using SSE ([Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)). Each chunk is sent as a line prefixed with `data: `.

**Note:** To process streamed chunks and accumulate the final message, you can use the `messageReducer` function from `utils.js`.

### Example SSE Response
```
event: message
data: {"id":"resp_Ex3lWohFjJ","object":"chat.completion.chunk","created":1753350448,"model":"sstrader-2","choices":[{"index":0,"delta":{"reason":{"text":"Thinking..."}},"logprobs":null,"finish_reason":null}]}

event: message
data: {"id":"resp_Ex3lWohFjJ","object":"chat.completion.chunk","created":1753350448,"model":"sstrader-2","choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":null}]}

event: message
data: {"id":"resp_Ex3lWohFjJ","object":"chat.completion.chunk","created":1753350448,"model":"sstrader-2","choices":[{"index":0,"delta":{"content":"Hello! How can I assist you with sports today?"},"logprobs":null,"finish_reason":null}]}

event: message
data: {"id":"resp_Ex3lWohFjJ","object":"chat.completion.chunk","created":1753350448,"model":"sstrader-2","choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}

event: message
data: [DONE]
```

### Chunk Format
```
{
    "id": "<resp_id>",
    "object": "chat.completion.chunk",
    "created": <unix_timestamp>,
    "model": "<model_name>",
    "choices": [{ "index": 0, "delta": {}, "logprobs": null, "finish_reason": null }],
};
```
- `delta`: Contains incremental content, actions, or reasons.
- `finish_reason`: When set to `'stop'`, the stream ends.

### End of Stream
The stream ends when `chatCompletitonChunk.choices[0].finish_reason = 'stop'`.
A final chunk with `data: [DONE]` is sent to indicate completion.

---

## Example Usage
```js
const url = 'https://your-api-host/api/v1/chat/completions';
const body = {
  model: 'your-model',
  messages: [
    { role: 'user', content: 'Hello, who won the last match?' }
  ],
  previous_response_id: 'resp_Ex3lWohFjJ'
  stream: true,
  metadata: { /* optional */ }
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify(body)
})
  .then(res => res.body.getReader())
  .then(reader => {
    // handle SSE stream here
  });
```

---

## Notes
- Use the `Authorization: Bearer` header for authentication.
- SSE stream delivers incremental updates as chat completion chunks.
- The stream ends when `finish_reason` is `'stop'`.

---

## Contact
For support or questions, contact the API maintainer.
