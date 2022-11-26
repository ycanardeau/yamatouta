import AppRoutes from '@/AppRoutes';
import { AuthProvider } from '@/AuthProvider';
import Header from '@/Header';
import SideNav from '@/SideNav';
import config from '@/config';
import '@/i18n';
import { EuiPage, EuiPageBody, EuiPageSideBar } from '@elastic/eui';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import { ScrollToTop } from '@vocadb/route-sphere';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.scss';

axios.defaults.baseURL = config.apiEndpoint;
axios.defaults.withCredentials = true;

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// See https://github.com/elastic/eui/issues/5436 and https://elastic.github.io/eui/#/utilities/provider.
const emotionCache = createCache({
	key: 'app',
	container:
		document.querySelector<HTMLElement>('meta[name="emotion-global"]') ??
		undefined,
});

const App = (): React.ReactElement => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<EuiProvider colorMode="dark" cache={emotionCache}>
					<ScrollToTop />

					<Header />

					<EuiPage paddingSize="none">
						<EuiPageSideBar paddingSize="l" sticky>
							<SideNav />
						</EuiPageSideBar>

						<EuiPageBody panelled>
							<React.Suspense fallback={null /* TODO */}>
								<AppRoutes />
							</React.Suspense>
						</EuiPageBody>
					</EuiPage>
				</EuiProvider>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default App;
