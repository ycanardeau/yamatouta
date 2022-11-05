import { lazyImport } from '@/components/lazyImport';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminIndex = lazyImport(() => import('./AdminIndex'));

const AdminRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<AdminIndex />} />
		</Routes>
	);
};

export default AdminRoutes;
