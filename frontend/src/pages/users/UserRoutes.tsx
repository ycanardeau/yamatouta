import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UserIndex = React.lazy(() => import('./UserIndex'));
const UserDetails = React.lazy(() => import('./UserDetails'));

const UserRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<UserIndex />} />
			<Route path=":userId/*" element={<UserDetails />} />
		</Routes>
	);
};

export default UserRoutes;
