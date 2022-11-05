import { lazyImport } from '@/components/lazyImport';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const HashtagIndex = lazyImport(() => import('./HashtagIndex'));
const HashtagDetails = lazyImport(() => import('./HashtagDetails'));

const HashtagRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<HashtagIndex />} />
			<Route path=":name/*" element={<HashtagDetails />} />
		</Routes>
	);
};

export default HashtagRoutes;
