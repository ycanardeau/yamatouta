import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

axios.defaults.withCredentials = true;

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
