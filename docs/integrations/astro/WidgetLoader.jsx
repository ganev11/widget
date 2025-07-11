import { useEffect } from "preact/hooks";

const PUBLIC_SITE_URL = "https://cf.sstrader.com";

export function WidgetLoader({ widgetConfig }) {
	useEffect(() => {
		if (window.SST && window.SST.initialized) return;

		if (!window.SST) {
			(function (w, d, s, o, f, js, fjs) {
				w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
				js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
				js.id = o; js.src = f; js.async = 1; js.type = 'module'; fjs.parentNode.insertBefore(js, fjs);
			}(window, document, 'script', 'SST', `${PUBLIC_SITE_URL}/widget.js`));
		}
		if (window.SST && !window.SST.initialized) {
			if (widgetConfig && typeof widgetConfig === 'object' && !Array.isArray(widgetConfig)) {
				window.SST('init', widgetConfig);
			} else {
				window.SST('init', { minimized: true, css_url: `${PUBLIC_SITE_URL}/widget.css` });
			}
			window.SST.initialized = true;
		}
		return () => {
			if (window.SST) {
				window.SST('destroy');
				window.SST.initialized = false;
			}
		};
	}, [widgetConfig]);

	return null;
}