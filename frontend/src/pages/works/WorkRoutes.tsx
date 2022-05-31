import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { lazyImport } from '../../components/lazyImport';

const WorkIndex = lazyImport(() => import('./WorkIndex'));
const WorkCreate = lazyImport(() => import('./WorkCreate'));
const WorkDetails = lazyImport(() => import('./WorkDetails'));
const WorkEdit = lazyImport(() => import('./WorkEdit'));
const WorkHistory = lazyImport(() => import('./WorkHistory'));

const WorkRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<WorkIndex />} />
			<Route path="create" element={<WorkCreate />} />
			<Route path=":id/edit" element={<WorkEdit />} />
			<Route path=":id/revisions" element={<WorkHistory />} />
			<Route path=":id/*" element={<WorkDetails />} />
		</Routes>
	);
};

export default WorkRoutes;
