import { AppBar, Container, Tab, Tabs, Toolbar } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const AppHeader = (): React.ReactElement => {
	const { t } = useTranslation();

	const { pathname } = useLocation();

	return (
		<AppBar position="sticky">
			<Container maxWidth="lg">
				<Toolbar variant="dense" disableGutters>
					<Tabs value={`/${pathname.split('/')[1]}`}>
						<Tab
							label={t('shared.quotes')}
							value="/quotes"
							component={RouterLink}
							to="/quotes"
						/>
						<Tab
							label={t('shared.artists')}
							value="/artists"
							component={RouterLink}
							to="/artists"
						/>
					</Tabs>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default AppHeader;
