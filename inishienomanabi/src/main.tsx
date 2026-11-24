import React from 'react';
import ReactDOM from 'react-dom';

// The site comes in two looks, chosen at build time (see .env.bootstrap and
// .env.eui). Only the chosen one is loaded.
const loadApp = (): Promise<{ default: React.ComponentType }> =>
	import.meta.env.VITE_THEME === 'eui'
		? import('@/eui/App')
		: import('@/bootstrap/App');

loadApp().then(({ default: App }) => {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById('root'),
	);
});
