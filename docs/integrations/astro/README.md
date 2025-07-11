# WidgetLoader Integration Example

This example demonstrates how to use the `WidgetLoader` component in an Astro project with Preact. The integration loads a widget from an external source and initializes it with custom configuration.

## Usage

The following code shows how to use `WidgetLoader` in a page layout:

```astro
---
import Main from "@/layouts/Main.astro";
import { WidgetLoader } from "@/components/WidgetLoader";
---

<Main>
    <!-- Main content -->
    <WidgetLoader widgetConfig={{cookieAuth: true}} client:only="preact" />
</Main>
```

## How It Works

- The `WidgetLoader` component loads an external widget script and stylesheet from `https://cf.sstrader.com`.
- It initializes the widget with the provided `widgetConfig` prop. In this example, `{cookieAuth: true}` is passed for authentication.
- The widget is destroyed when the component unmounts.

## Requirements

- Astro project with Preact integration.
- The `WidgetLoader.jsx` component should be available in your components directory.

## Reference

See the implementation in `WidgetLoader.jsx` for details on how the widget is loaded and initialized.
