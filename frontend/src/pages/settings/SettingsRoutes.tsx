import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const SettingsIndex = lazyWithRetry(() => import('./SettingsIndex'));

const SettingsRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<SettingsIndex />} />
		</Routes>
	);
};

export default SettingsRoutes;
