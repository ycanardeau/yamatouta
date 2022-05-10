import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from '../../components/lazyImport';

const WorkIndex = lazyImport(() => import('./WorkIndex'));
const WorkDetails = lazyImport(() => import('./WorkDetails'));

const WorkRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<WorkIndex />} />
			<Route path=":workId/*" element={<WorkDetails />} />
		</Routes>
	);
};

export default WorkRoutes;
