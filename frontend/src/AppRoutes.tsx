import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from './components/lazyWithRetry';

const ArtistRoutes = lazyWithRetry(
	() => import('./pages/artists/ArtistRoutes'),
);
const QuoteRoutes = lazyWithRetry(() => import('./pages/quotes/QuoteRoutes'));
const TranslationRoutes = lazyWithRetry(
	() => import('./pages/translations/TranslationRoutes'),
);
const UserRoutes = lazyWithRetry(() => import('./pages/users/UserRoutes'));
const HomeRoutes = lazyWithRetry(() => import('./pages/home/HomeRoutes'));
const SettingsRoutes = lazyWithRetry(
	() => import('./pages/settings/SettingsRoutes'),
);

const AppRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="artists/*" element={<ArtistRoutes />} />
			<Route path="quotes/*" element={<QuoteRoutes />} />
			<Route path="translations/*" element={<TranslationRoutes />} />
			<Route path="users/*" element={<UserRoutes />} />
			<Route path="settings/*" element={<SettingsRoutes />} />
			<Route path="*" element={<HomeRoutes />} />
		</Routes>
	);
};

export default AppRoutes;