import { EuiPage, EuiPageBody, EuiPageSideBar } from '@elastic/eui';
import React from 'react';
import ReactGA from 'react-ga4';

import './App.scss';
import AppRoutes from './AppRoutes';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import SideNav from './SideNav';
import config from './config';

const App = (): React.ReactElement => {
	React.useEffect(() => {
		if (config.gaMeasurementId) ReactGA.initialize(config.gaMeasurementId);
	}, []);

	return (
		<>
			<ScrollToTop />

			<Header />

			<EuiPage paddingSize="none">
				<EuiPageSideBar paddingSize="l" sticky>
					<SideNav />
				</EuiPageSideBar>

				<EuiPageBody panelled>
					<React.Suspense fallback={null /* TODO */}>
						<AppRoutes />
					</React.Suspense>
				</EuiPageBody>
			</EuiPage>
		</>
	);
};

export default App;
