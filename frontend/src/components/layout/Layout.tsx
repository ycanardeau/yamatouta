import { Box, Grid, Stack } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import Breadcrumb from './Breadcrumb';

interface LayoutProps {
	breadcrumbItems: {
		text: string;
		to: string;
		isCurrentItem?: boolean;
	}[];
	actions?: React.ReactNode;
	children?: React.ReactNode;
	meta?: {
		description?: string;
	};
	sidebar?: React.ReactNode;
}

const Layout = ({
	breadcrumbItems,
	actions,
	children,
	meta,
	sidebar,
}: LayoutProps): React.ReactElement => {
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

			<Grid container spacing={2}>
				<Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
					<Stack direction="row">
						<Breadcrumb items={breadcrumbItems} />
						<Box sx={{ flex: 1 }} />
						{actions}
					</Stack>

					{children}
				</Grid>

				<Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
					{sidebar}
				</Grid>
			</Grid>
		</>
	);
};

export default Layout;
