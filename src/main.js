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

	// mount lifecycle state
	let mounted = false;
	let container = null;
	let shadowRoot = null;
	let retryTimer = null;
	let retryCount = 0;
	const MAX_RETRY = 50; // ~2.5s at 50ms
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

		// 1) create or use host element
		let host = null;
		if (config.target) {
			if (typeof config.target === 'string') {
				host = d.querySelector(config.target);
			} else {
				host = config.target;
			}
			if (!host) {
				// target may not exist yet due to async layout/hydration; retry briefly
				if (retryCount < MAX_RETRY) {
					retryCount++;
					retryTimer = setTimeout(mount, 50);
				} else {
					console.warn('Widget target not found (giving up):', config.target);
				}
				return; // do not set mounted; allow retry later
			}
		} else {
			host = d.createElement('div');
			host.id = `hw-widget-root-${globalName}`;
			host.className = 'hw-widget-root';
			d.body.appendChild(host);
		}

		// 2) attach an open shadow root
		const root = host.attachShadow ? (host.shadowRoot || host.attachShadow({ mode: 'open' })) : host;

		// 3) inject external CSS into shadow root
		if (config.css_url) {
			const urls = Array.isArray(config.css_url) ? config.css_url : [config.css_url];
			urls.forEach(url => {
				const link = d.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('href', url);
				root.appendChild(link);
			});
		}

		// 4) initial render
		try {
			render(
				h(Widget, config),
				root
			);
		} finally {
			// update lifecycle state only after we attempted to render
			container = host;
			shadowRoot = root;
			mounted = true;
			retryCount = 0;
			if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
		}
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
	// clear any pending retries
	if (retryTimer) { try { clearTimeout(retryTimer); } catch (e) {} retryTimer = null; }
	retryCount = 0;

	// 1) Unmount Preact tree
		if (shadowRoot) {
			try { render(null, shadowRoot); } catch (e) {}
			// 2) Clear shadow DOM content to remove injected styles and DOM
			try { while (shadowRoot.firstChild) shadowRoot.removeChild(shadowRoot.firstChild); } catch (e) {}
		}
		// 3) Remove dynamically-created host (only if we created it)
		if (container && container.parentNode && !config.target) {
			try { container.remove(); } catch (e) {}
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
