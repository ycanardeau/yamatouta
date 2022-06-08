import { EuiPage, EuiPageBody, EuiPageSideBar } from '@elastic/eui';
import { ScrollToTop } from '@vocadb/route-sphere';
import React from 'react';

import './App.scss';
import AppRoutes from './AppRoutes';
import Header from './Header';
import SideNav from './SideNav';

const App = (): React.ReactElement => {
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
