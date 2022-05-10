import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from './components/lazyImport';

const ArtistRoutes = lazyImport(() => import('./pages/artists/ArtistRoutes'));
const QuoteRoutes = lazyImport(() => import('./pages/quotes/QuoteRoutes'));
const TranslationRoutes = lazyImport(
	() => import('./pages/translations/TranslationRoutes'),
);
const UserRoutes = lazyImport(() => import('./pages/users/UserRoutes'));
const HomeRoutes = lazyImport(() => import('./pages/home/HomeRoutes'));
const SettingsRoutes = lazyImport(
	() => import('./pages/settings/SettingsRoutes'),
);
const AdminRoutes = lazyImport(() => import('./pages/admin/AdminRoutes'));
const WorkRoutes = lazyImport(() => import('./pages/works/WorkRoutes'));

const AppRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="artists/*" element={<ArtistRoutes />} />
			<Route path="quotes/*" element={<QuoteRoutes />} />
			<Route path="translations/*" element={<TranslationRoutes />} />
			<Route path="users/*" element={<UserRoutes />} />
			<Route path="settings/*" element={<SettingsRoutes />} />
			<Route path="*" element={<HomeRoutes />} />
			<Route path="admin/*" element={<AdminRoutes />} />
			<Route path="works/*" element={<WorkRoutes />} />
		</Routes>
	);
};

export default AppRoutes;
