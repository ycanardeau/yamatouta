import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const WorkIndex = lazyWithRetry(() => import('./WorkIndex'));

const WorkRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<WorkIndex />} />
		</Routes>
	);
};

export default WorkRoutes;
