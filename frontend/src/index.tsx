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

axios.interceptors.request.use((config) => {
	if (!config.headers)
		throw new Error("Expected 'config.headers' not to be undefined");

	// Code from: https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-6.0#javascript.
	const xsrfToken = document.cookie
		.split('; ')
		.find((row) => row.startsWith('XSRF-TOKEN='))
		?.split('=')[1];

	if (xsrfToken) config.headers['X-XSRF-TOKEN'] = xsrfToken;

	return config;
});

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<HelmetProvider>
					<App />
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
