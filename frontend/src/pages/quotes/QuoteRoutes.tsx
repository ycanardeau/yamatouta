import { lazyImport } from '@/components/lazyImport';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const QuoteIndex = lazyImport(() => import('./QuoteIndex'));
const QuoteCreate = lazyImport(() => import('./QuoteCreate'));
const QuoteDetails = lazyImport(() => import('./QuoteDetails'));
const QuoteEdit = lazyImport(() => import('./QuoteEdit'));
const QuoteHistory = lazyImport(() => import('./QuoteHistory'));

const QuoteRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<QuoteIndex />} />
			<Route path="create" element={<QuoteCreate />} />
			<Route path=":id/edit" element={<QuoteEdit />} />
			<Route path=":id/revisions" element={<QuoteHistory />} />
			<Route path=":id/*" element={<QuoteDetails />} />
		</Routes>
	);
};

export default QuoteRoutes;
