import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from '../../components/lazyImport';

const QuoteIndex = lazyImport(() => import('./QuoteIndex'));
const QuoteDetails = lazyImport(() => import('./QuoteDetails'));

const QuoteRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<QuoteIndex />} />
			<Route path=":quoteId/*" element={<QuoteDetails />} />
		</Routes>
	);
};

export default QuoteRoutes;
