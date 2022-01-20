import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { logout } from './api/AuthApi';
import LoginDialog from './components/LoginDialog';
import RegisterDialog from './components/RegisterDialog';
import { useAuth } from './components/useAuth';
import config from './config';

const AppHeader = (): React.ReactElement => {
	const { t } = useTranslation();

	const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
	const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);

	const { pathname } = useLocation();
	const navigate = useNavigate();

	const pages = React.useMemo((): { title: string; path: string }[] => {
		return [
			// TODO: { title: t('shared.words'), path: '/translations' },
			{ title: t('shared.quotes'), path: '/quotes' },
			{ title: t('shared.artists'), path: '/artists' },
			{ title: t('shared.users'), path: '/users' },
		];
	}, [t]);

	const [anchorElNav, setAnchorElNav] = React.useState<
		(EventTarget & HTMLButtonElement) | undefined
	>();

	const [anchorElUser, setAnchorElUser] = React.useState<
		(EventTarget & HTMLButtonElement) | undefined
	>();

	const handleOpenNavMenu = (
		e: React.MouseEvent<HTMLButtonElement>,
	): void => {
		setAnchorElNav(e.currentTarget);
	};

	const handleOpenUserMenu = (
		e: React.MouseEvent<HTMLButtonElement>,
	): void => {
		setAnchorElUser(e.currentTarget);
	};

	const handleCloseNavMenu = (): void => {
		setAnchorElNav(undefined);
	};

	const handleCloseUserMenu = (): void => {
		setAnchorElUser(undefined);
	};

	const auth = useAuth();

	return (
		<AppBar position="sticky">
			<Container maxWidth="lg">
				<Toolbar variant="dense" disableGutters>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'flex', md: 'none' },
						}}
					>
						<IconButton
							size="large"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem
									onClick={handleCloseNavMenu}
									component={RouterLink}
									to={page.path}
									key={page.path}
								>
									<Typography textAlign="center">
										{page.title}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<Tabs
						value={`/${pathname.split('/')[1]}`}
						sx={{ display: { xs: 'none', md: 'flex' } }}
					>
						{pages.map((page) => (
							<Tab
								label={page.title}
								value={page.path}
								component={RouterLink}
								to={page.path}
								key={page.path}
							/>
						))}
					</Tabs>
					<Box sx={{ flexGrow: 1 }} />
					<Stack direction="row" spacing={2}>
						{!auth.loading &&
							(auth.user ? (
								<>
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ p: 0 }}
									>
										<Avatar
											src={auth.user.avatarUrl}
											sx={{ width: 32, height: 32 }}
										/>
									</IconButton>
									<Menu
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										<MenuItem
											onClick={handleCloseUserMenu}
											component={RouterLink}
											to={`/users/${auth.user.id}`}
										>
											<Avatar
												src={auth.user.avatarUrl}
												sx={{
													width: 32,
													height: 32,
													ml: -0.5,
													mr: 1,
												}}
											/>
											<Typography textAlign="center">
												{t('users.profile')}
											</Typography>
										</MenuItem>
										<MenuItem
											onClick={async (): Promise<void> => {
												handleCloseUserMenu();

												await logout();

												auth.setUser(undefined);

												localStorage.removeItem(
													'isAuthenticated',
												);

												navigate('/');
											}}
										>
											<ListItemIcon>
												<LogoutIcon fontSize="small" />
											</ListItemIcon>
											<Typography textAlign="center">
												{t('auth.logOut')}
											</Typography>
										</MenuItem>
									</Menu>
								</>
							) : (
								<>
									<Button
										variant="text"
										onClick={(): void =>
											setLoginDialogOpen(true)
										}
									>
										{t('auth.logIn')}
									</Button>
									<Button
										variant="outlined"
										onClick={(): void =>
											setRegisterDialogOpen(true)
										}
										disabled={config.disableAccountCreation}
									>
										{t('auth.register')}
									</Button>
								</>
							))}
					</Stack>
				</Toolbar>
			</Container>

			{loginDialogOpen && (
				<LoginDialog
					onClose={(): void => setLoginDialogOpen(false)}
					onLoginComplete={(user): void => {
						setLoginDialogOpen(false);

						auth.setUser(user);

						localStorage.setItem('isAuthenticated', 'true');

						navigate('/');
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
