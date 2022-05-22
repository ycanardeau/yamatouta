import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from '../../components/lazyImport';

const TranslationIndex = lazyImport(() => import('./TranslationIndex'));
const TranslationCreate = lazyImport(() => import('./TranslationCreate'));
const TranslationDetails = lazyImport(() => import('./TranslationDetails'));
const TranslationEdit = lazyImport(() => import('./TranslationEdit'));
const TranslationHistory = lazyImport(() => import('./TranslationHistory'));

const TranslationRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<TranslationIndex />} />
			<Route path="create" element={<TranslationCreate />} />
			<Route path=":id/edit" element={<TranslationEdit />} />
			<Route path=":id/revisions" element={<TranslationHistory />} />
			<Route path=":id/*" element={<TranslationDetails />} />
		</Routes>
	);
};

export default TranslationRoutes;
