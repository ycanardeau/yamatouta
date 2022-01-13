import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyWithRetry from '../../components/lazyWithRetry';

const ArtistIndex = lazyWithRetry(() => import('./ArtistIndex'));
const ArtistDetails = lazyWithRetry(() => import('./ArtistDetails'));

const ArtistRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<ArtistIndex />} />
			<Route path=":artistId/*" element={<ArtistDetails />} />
		</Routes>
	);
};

export default ArtistRoutes;
