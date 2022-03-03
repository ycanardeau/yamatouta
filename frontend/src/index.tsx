import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './AuthProvider';
import config from './config';
import './i18n';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = config.apiEndpoint;
axios.defaults.withCredentials = true;

// See https://github.com/elastic/eui/issues/5436 and https://elastic.github.io/eui/#/utilities/provider.
const emotionCache = createCache({
	key: 'app',
	container:
		document.querySelector<HTMLElement>('meta[name="emotion-global"]') ??
		undefined,
});

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<HelmetProvider>
					<EuiProvider colorMode="dark" cache={emotionCache}>
						<App />
					</EuiProvider>
				</HelmetProvider>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
