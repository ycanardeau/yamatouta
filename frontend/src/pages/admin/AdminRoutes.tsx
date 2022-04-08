import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const AdminIndex = lazyWithRetry(() => import('./AdminIndex'));

const AdminRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<AdminIndex />} />
		</Routes>
	);
};

export default AdminRoutes;
