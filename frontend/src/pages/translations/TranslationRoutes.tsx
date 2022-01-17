import React from 'react';
import { Route, Routes } from 'react-router-dom';

const TranslationIndex = React.lazy(() => import('./TranslationIndex'));

const TranslationRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<TranslationIndex />}></Route>
		</Routes>
	);
};

export default TranslationRoutes;
