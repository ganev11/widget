import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [preact()],
	build: {
		lib: {
			entry: 'src/main.js',
			name: '_hwWidget',
			fileName: () => 'widget.js',
			formats: ['iife']
		},
		rollupOptions: {
			output: {
				assetFileNames: 'widget.css'
			}
		}
	},
	define: { 'process.env.NODE_ENV': '"production"' }
});
