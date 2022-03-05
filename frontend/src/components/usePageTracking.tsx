// Code from: https://github.com/VocaDB/vocadb/blob/765cc0b573411cf1f6436b3e4a1043dff9a66402/VocaDbWeb/Scripts/Components/usePageTracking.ts
import React from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

// Captures pageviews as a new page is loaded.
// The call to usePageTracking must go after useTitle.
// Set ready to false while translations are not yet loaded.
// This prevents Google Analytics from using an incomplete page title (e.g. `Index.Discussions - Vocaloid Database`).
export const usePageTracking = (ready: boolean): void => {
	const location = useLocation();

	React.useEffect(() => {
		if (ready) {
			ReactGA.send({
				hitType: 'pageview',
				page: `${location.pathname}${location.search}`,
			});
		}
	}, [ready, location]);
};
