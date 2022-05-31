import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { lazyImport } from '../../components/lazyImport';

const SettingsIndex = lazyImport(() => import('./SettingsIndex'));

const SettingsRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<SettingsIndex />} />
		</Routes>
	);
};

export default SettingsRoutes;
