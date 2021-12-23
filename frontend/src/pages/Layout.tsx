import { Grid } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../components/Breadcrumb';

interface ILayoutProps {
	breadcrumbItems: {
		text: string;
		to: string;
		isCurrentItem?: boolean;
	}[];
	children?: React.ReactNode;
	meta?: {
		description?: string;
	};
}

const Layout = ({
	breadcrumbItems,
	children,
	meta,
}: ILayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	return (
		<>
			<Helmet>
				<meta
					name="description"
					content={
						meta?.description ??
						(ready ? t('layout.siteDescription') : undefined)
					}
				/>
			</Helmet>

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
