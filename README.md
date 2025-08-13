# Widget

A simple Preact-based chat widget built with Vite.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

This runs the widget at `http://localhost:5173/`.

To create a production build run:

```bash
npm run build
```

The build artifacts are emitted into the `dist/` directory. You can preview the
production build locally with:

```bash
npm run preview
```

## Embedding the Widget

Include the compiled script and CSS on the host page and initialize the widget
through the global function. Below is the minimal snippet used in the project:

```html
(function (w, d, s, o, f, js, fjs) {
  w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
  js = d.createElement(s); fjs = d.getElementsByTagName(s)[0];
  js.id = o; js.src = f; js.async = 1; js.type = 'module';
  fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', 'SST', 'https://example.com/widget/widget.js'));
SST('init', { minimized: true, css_url: 'https://example.com/widget/widget.css' });
```

Replace the URLs with the location of your hosted `widget.js` and `widget.css`.

## Configuration

`SST('init', options)` accepts a configuration object. The defaults come from
`getDefaultConfig` in `src/main.js`:

```js
{
  minimized: true,              // start in a minimized state
  css_url: ['/widget.css'],     // CSS file(s) to load
  api_key: '',                  // optional API key
  globalName: 'SST',            // global function name
  embedding: false,             // when true the widget renders into `target`
  header: true,                 // show header bar
  footer: true,                 // show footer bar
  baseURL: 'https://api.example.com', // API base URL
  model: 'example-model',       // model used for chat requests
  metadata: null,               // extra metadata sent to the API
  cookieAuth: false             // enable cookie based authentication
}
```

Additional options include:

- `target` – CSS selector or element where the widget should be mounted when
  embedding.
- `noCredits` – set to `true` to hide the "Powered by" footer.

Use these options to tailor the widget to your application.

## Integrations
### Astro Framework

You can easily integrate the widget into an Astro project using the provided Preact component. See the integration guide for details:

- [Astro Integration Example](./docs/integrations/astro/README.md)

This example demonstrates how to use the `WidgetLoader` component to load and configure the chat widget in Astro with Preact support.

## Events (DOM CustomEvent API)

The widget now dispatches native `CustomEvent`s on `window`. Listen using standard `addEventListener`.

### Example
```js
window.addEventListener('sst:init', (e) => {
  console.log('Widget initialized', e.detail.config);
});
window.addEventListener('sst:message:token', (e) => {
  console.log('Token chunk', e.detail.token);
});
```

### Event Names & Details

| Event | `event.detail` |
|-------|----------------|
| `sst:init` | `{ config }` |
| `sst:destroy` | `undefined` |
| `sst:typing` | `{ value }` current textarea value |
| `sst:typing:submit` | `undefined` |
| `sst:message:send` | `{ question }` user message object |
| `sst:message:token` | `{ token }` streamed content token |
| `sst:message:done` | `{ message }` final assistant message object |
| `sst:message:cancel` | `undefined` |

Event names are prefixed with `sst:` to avoid collisions.

### Ordering / Timing
If you attach listeners after `sst:init` has already fired you won't get a replay. Add your listeners before calling `SST('init', ...)` or as early as possible.

### Custom Events From Host
If needed you can dispatch your own namespaced events:
```js
window.dispatchEvent(new CustomEvent('sst:host:ping', { detail: { t: Date.now() }}));
```
