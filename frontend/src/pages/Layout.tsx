import { Grid } from '@mui/material';
import React from 'react';

import Breadcrumb from '../components/Breadcrumb';

interface ILayoutProps {
	breadcrumbItems: {
		text: string;
		to: string;
		isCurrentItem?: boolean;
	}[];
	children?: React.ReactNode;
}

const Layout = ({
	breadcrumbItems,
	children,
}: ILayoutProps): React.ReactElement => {
	return (
		<>
			<Breadcrumb items={breadcrumbItems} />

			<Grid container>
				<Grid item xs={12} md={9}>
					{children}
				</Grid>
			</Grid>
		</>
	);
};

export default Layout;
