import { lazyImport } from '@/components/lazyImport';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UserIndex = lazyImport(() => import('./UserIndex'));
const UserDetails = lazyImport(() => import('./UserDetails'));

const UserRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<UserIndex />} />
			<Route path=":id/*" element={<UserDetails />} />
		</Routes>
	);
};

export default UserRoutes;
