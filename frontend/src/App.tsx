import AppRoutes from '@/AppRoutes';
import { AuthProvider } from '@/AuthProvider';
import { Compose } from '@/Compose';
import Header from '@/Header';
import SideNav from '@/SideNav';
import config from '@/config';
import '@/i18n';
import '@/icons';
import { EuiPageTemplate, EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import { ScrollToTop } from '@aigamo/route-sphere';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.baseURL = config.apiEndpoint;

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// See https://github.com/elastic/eui/issues/5436 and https://elastic.github.io/eui/#/utilities/provider.
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return (
		<Compose components={[AuthProvider, BrowserRouter]}>
			<EuiProvider colorMode="dark" cache={euiCache}>
				<ScrollToTop />

				<Header />

				<EuiPageTemplate panelled restrictWidth>
					<EuiPageTemplate.Sidebar sticky>
						<SideNav />
					</EuiPageTemplate.Sidebar>

					<React.Suspense fallback={null /* TODO */}>
						<AppRoutes />
					</React.Suspense>
				</EuiPageTemplate>
			</EuiProvider>
		</Compose>
	);
};

export default App;
