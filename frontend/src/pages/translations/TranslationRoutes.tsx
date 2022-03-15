import React from 'react';
import { Route, Routes } from 'react-router-dom';

const TranslationIndex = React.lazy(() => import('./TranslationIndex'));
const TranslationDetails = React.lazy(() => import('./TranslationDetails'));

const TranslationRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<TranslationIndex />} />
			<Route path=":translationId/*" element={<TranslationDetails />} />
		</Routes>
	);
};

export default TranslationRoutes;
