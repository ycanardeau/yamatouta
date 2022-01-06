import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes } from 'react-router-dom';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ScrollToTop from './ScrollToTop';
import lazyWithRetry from './components/lazyWithRetry';
import config from './config';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

const ArtistRoutes = lazyWithRetry(
	() => import('./pages/artists/ArtistRoutes'),
);
const QuoteRoutes = lazyWithRetry(() => import('./pages/quotes/QuoteRoutes'));
const TranslationRoutes = lazyWithRetry(
	() => import('./pages/translations/TranslationRoutes'),
);
const UserRoutes = lazyWithRetry(() => import('./pages/users/UserRoutes'));
const HomeRoutes = lazyWithRetry(() => import('./pages/home/HomeRoutes'));

const App = (): React.ReactElement => {
	React.useEffect(() => {
		if (config.gaMeasurementId) ReactGA.initialize(config.gaMeasurementId);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<ScrollToTop />

			<CssBaseline />
			<AppHeader />

			<Container
				maxWidth="lg"
				sx={{ paddingTop: '30px', paddingBottom: '20px' }}
			>
				<React.Suspense fallback={null /* TODO */}>
					<Routes>
						<Route path="artists/*" element={<ArtistRoutes />} />
						<Route path="quotes/*" element={<QuoteRoutes />} />
						<Route
							path="translations/*"
							element={<TranslationRoutes />}
						/>
						<Route path="users/*" element={<UserRoutes />} />
						<Route path="*" element={<HomeRoutes />} />
					</Routes>
				</React.Suspense>
			</Container>

			<AppFooter />
		</ThemeProvider>
	);
};

export default App;
