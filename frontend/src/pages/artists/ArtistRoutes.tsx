import React from 'react';
import { Route, Routes } from 'react-router-dom';

import lazyImport from '../../components/lazyImport';

const ArtistIndex = lazyImport(() => import('./ArtistIndex'));
const ArtistCreate = lazyImport(() => import('./ArtistCreate'));
const ArtistDetails = lazyImport(() => import('./ArtistDetails'));
const ArtistEdit = lazyImport(() => import('./ArtistEdit'));
const ArtistHistory = lazyImport(() => import('./ArtistHistory'));

const ArtistRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<ArtistIndex />} />
			<Route path="create" element={<ArtistCreate />} />
			<Route path=":id/edit" element={<ArtistEdit />} />
			<Route path=":id/revisions" element={<ArtistHistory />} />
			<Route path=":id/*" element={<ArtistDetails />} />
		</Routes>
	);
};

export default ArtistRoutes;
