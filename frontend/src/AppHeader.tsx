import {
	AppBar,
	Box,
	Button,
	Container,
	Stack,
	Tab,
	Tabs,
	Toolbar,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import LoginDialog from './components/LoginDialog';
import RegisterDialog from './components/RegisterDialog';

const AppHeader = (): React.ReactElement => {
	const { t } = useTranslation();

	const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
	const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);

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
					<Box sx={{ flexGrow: 1 }} />
					<Stack direction="row" spacing={2}>
						<Button
							variant="text"
							onClick={(): void => setLoginDialogOpen(true)}
						>
							{t('auth.logIn')}
						</Button>
						<Button
							variant="outlined"
							onClick={(): void => setRegisterDialogOpen(true)}
						>
							{t('auth.register')}
						</Button>
					</Stack>
				</Toolbar>
			</Container>

			{loginDialogOpen && (
				<LoginDialog
					onClose={(): void => setLoginDialogOpen(false)}
					onLoginComplete={(user): void => {
						setLoginDialogOpen(false);

						// TODO
					}}
				/>
			)}
			{registerDialogOpen && (
				<RegisterDialog
					onClose={(): void => setRegisterDialogOpen(false)}
					onRegisterComplete={(user): void => {
						setRegisterDialogOpen(false);

						// TODO
					}}
				/>
			)}
		</AppBar>
	);
};

export default AppHeader;
