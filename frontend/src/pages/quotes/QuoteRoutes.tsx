import React from 'react';
import { Route, Routes } from 'react-router-dom';

const QuoteIndex = React.lazy(() => import('./QuoteIndex'));
const QuoteDetails = React.lazy(() => import('./QuoteDetails'));

const QuoteRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<QuoteIndex />} />
			<Route path=":quoteId" element={<QuoteDetails />} />
		</Routes>
	);
};

export default QuoteRoutes;
