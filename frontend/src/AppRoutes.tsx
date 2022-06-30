import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { lazyImport } from './components/lazyImport';

const AdminRoutes = lazyImport(() => import('./pages/admin/AdminRoutes'));
const ArtistRoutes = lazyImport(() => import('./pages/artists/ArtistRoutes'));
const HashtagRoutes = lazyImport(
	() => import('./pages/hashtags/HashtagRoutes'),
);
const QuoteRoutes = lazyImport(() => import('./pages/quotes/QuoteRoutes'));
const SettingsRoutes = lazyImport(
	() => import('./pages/settings/SettingsRoutes'),
);
const TranslationRoutes = lazyImport(
	() => import('./pages/translations/TranslationRoutes'),
);
const UserRoutes = lazyImport(() => import('./pages/users/UserRoutes'));
const WorkRoutes = lazyImport(() => import('./pages/works/WorkRoutes'));
const HomeRoutes = lazyImport(() => import('./pages/home/HomeRoutes'));

const AppRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="admin/*" element={<AdminRoutes />} />
			<Route path="artists/*" element={<ArtistRoutes />} />
			<Route path="hashtags/*" element={<HashtagRoutes />} />
			<Route path="quotes/*" element={<QuoteRoutes />} />
			<Route path="settings/*" element={<SettingsRoutes />} />
			<Route path="translations/*" element={<TranslationRoutes />} />
			<Route path="users/*" element={<UserRoutes />} />
			<Route path="works/*" element={<WorkRoutes />} />
			<Route path="*" element={<HomeRoutes />} />
		</Routes>
	);
};

export default AppRoutes;
