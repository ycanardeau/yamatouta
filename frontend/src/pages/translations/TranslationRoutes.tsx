import React from 'react';
import { Route, Routes } from 'react-router-dom';

const TranslationIndex = React.lazy(() => import('./TranslationIndex'));

const TranslationRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<TranslationIndex />} />
		</Routes>
	);
};

export default TranslationRoutes;
