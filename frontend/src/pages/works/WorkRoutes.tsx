import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const WorkIndex = lazyWithRetry(() => import('./WorkIndex'));
const WorkDetails = lazyWithRetry(() => import('./WorkDetails'));

const WorkRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<WorkIndex />} />
			<Route path=":workId/*" element={<WorkDetails />} />
		</Routes>
	);
};

export default WorkRoutes;
