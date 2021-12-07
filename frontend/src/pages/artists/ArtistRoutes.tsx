import React from 'react';
import { Route, Routes } from 'react-router-dom';

const ArtistIndex = React.lazy(() => import('./ArtistIndex'));
const ArtistDetails = React.lazy(() => import('./ArtistDetails'));

const ArtistRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<ArtistIndex />} />
			<Route path=":artistId/*" element={<ArtistDetails />} />
		</Routes>
	);
};

export default ArtistRoutes;
