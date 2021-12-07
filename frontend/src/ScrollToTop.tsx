import React from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = (): null => {
	const location = useLocation();

	React.useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return null;
};

export default ScrollToTop;
