import { h, render } from 'preact';
import Widget from './Widget';

(function (w, d, o) {
	// Grab existing queue or make empty
	const queue = (w[o] && w[o].q) || [];

	function getDefaultConfig() {
		return {
			minimized: true,
			css_url: ['/widget.css'],
			api_key: '',
			globalName: o || 'SST',
			embedding: false,
			header: true,
			footer: true,
			baseURL: 'https://api.dev.app.sstrader.com',
			model: 'sstrader-2', // <-- set default model here
			metadata: null,
			previous_response_id: null,
			bookmaker_id: null, // for future use
			cookieAuth: false, // <-- default property for cookie-based auth
		};
	}

	let config = getDefaultConfig();

	// mount only once
	let mounted = false;
	let container = null;
	let shadowRoot = null;
	let globalName = config.globalName;

	// core handler
	function widgetFn(cmd, opts = {}) {
		if (cmd === 'init') {
			config = Object.assign(getDefaultConfig(), opts);
			globalName = config.globalName || o || 'SST';
			w[globalName] = widgetFn; // ensure global is always set to the right name
			mount();
		}
		if (cmd === 'destroy') {
			destroy();
		}
		// future commands (e.g. 'show','hide') can go here
		//switch (cmd) {
		// case 'hide':
		//  config.minimized = true;
		//  update();
		//  break;
		//   // …any future commands…
		//   default:
		//  console.warn(`_hw: unknown command "${cmd}"`);
		//}
	}

	function mount() {
		if (mounted) return;
		mounted = true;

		// 1) create or use host element
		if (config.target) {
			if (typeof config.target === 'string') {
				container = d.querySelector(config.target);
			} else {
				container = config.target;
			}
			if (!container) {
				console.warn('Widget target not found:', config.target);
				return;
			}
		} else {
			container = d.createElement('div');
			container.id = `hw-widget-root-${globalName}`;
			container.className = 'hw-widget-root';
			d.body.appendChild(container);
		}

		// 2) attach an open shadow root
		if (container.attachShadow) {
			shadowRoot = container.shadowRoot || container.attachShadow({ mode: 'open' });
		} else {
			shadowRoot = container;
		}

		// 3) inject external CSS into shadow root
		if (config.css_url) {
			if (Array.isArray(config.css_url)) {
				config.css_url.forEach(url => {
					const link = d.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('href', url);
					shadowRoot.appendChild(link);
				});
			} else {
				const link = d.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('href', config.css_url);
				shadowRoot.appendChild(link);
			}
		}

		// 4) initial render
		update();
	}

	function update() {
		if (!shadowRoot) return;
		// Render your Widget into the shadow DOM
		render(
			h(Widget, config),
			shadowRoot
		);
	}

	function destroy() {
		if (container && container.parentNode && !config.target) {
			container.remove();
		}
		mounted = false;
		container = null;
		shadowRoot = null;
	}

	// replace global API and replay queued calls
	w[globalName] = widgetFn;
	w[globalName].q = queue;
	// Only replay queue if it exists for this globalName
	if (queue && queue.length) {
		queue.forEach(args => w[globalName](...args));
	}
})(window, document, 'SST');
