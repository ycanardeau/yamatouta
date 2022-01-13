import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const QuoteIndex = lazyWithRetry(() => import('./QuoteIndex'));
const QuoteDetails = lazyWithRetry(() => import('./QuoteDetails'));

const QuoteRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<QuoteIndex />} />
			<Route path=":quoteId" element={<QuoteDetails />} />
		</Routes>
	);
};

export default QuoteRoutes;
