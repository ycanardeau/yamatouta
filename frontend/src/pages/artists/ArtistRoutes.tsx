import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from '../../components/lazyImport';

const ArtistIndex = lazyImport(() => import('./ArtistIndex'));
const ArtistDetails = lazyImport(() => import('./ArtistDetails'));

const ArtistRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<ArtistIndex />} />
			<Route path=":artistId/*" element={<ArtistDetails />} />
		</Routes>
	);
};

export default ArtistRoutes;
