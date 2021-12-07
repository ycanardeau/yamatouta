import { Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes } from 'react-router-dom';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ScrollToTop from './ScrollToTop';
import { config } from './config';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

const ArtistRoutes = React.lazy(() => import('./pages/artists/ArtistRoutes'));
const QuoteRoutes = React.lazy(() => import('./pages/quotes/QuoteRoutes'));
const HomeRoutes = React.lazy(() => import('./pages/home/HomeRoutes'));

const App = (): React.ReactElement => {
	React.useEffect(() => {
		ReactGA.initialize(config.gaMeasurementId || '');
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
						<Route path="*" element={<HomeRoutes />} />
					</Routes>
				</React.Suspense>
			</Container>

			<AppFooter />
		</ThemeProvider>
	);
};

export default App;
