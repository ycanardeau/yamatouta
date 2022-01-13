import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const UserIndex = lazyWithRetry(() => import('./UserIndex'));
const UserDetails = lazyWithRetry(() => import('./UserDetails'));

const UserRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<UserIndex />} />
			<Route path=":userId/*" element={<UserDetails />} />
		</Routes>
	);
};

export default UserRoutes;
