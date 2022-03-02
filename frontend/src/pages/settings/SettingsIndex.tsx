import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LaunchIcon from '@mui/icons-material/Launch';
import LockIcon from '@mui/icons-material/Lock';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import Layout from '../../components/layout/Layout';
import ChangeEmailDialog from '../../components/settings/ChangeEmailDialog';
import ChangePasswordDialog from '../../components/settings/ChangePasswordDialog';
import ChangeUsernameDialog from '../../components/settings/ChangeUsernameDialog';
import { useAuth } from '../../components/useAuth';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';

const SettingsIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('users.settings'), ready);

	const [changeUsernameDialogOpen, setChangeUsernameDialogOpen] =
		React.useState(false);

	const toggleChangeUsernameDialogOpen = (): void =>
		setChangeUsernameDialogOpen(!changeUsernameDialogOpen);

	const [changeEmailDialogOpen, setChangeEmailDialogOpen] =
		React.useState(false);

	const toggleChangeEmailDialogOpen = (): void =>
		setChangeEmailDialogOpen(!changeEmailDialogOpen);

	const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
		React.useState(false);

	const toggleChangePasswordDialogOpen = (): void =>
		setChangePasswordDialogOpen(!changePasswordDialogOpen);

	const auth = useAuth();

	return auth.user ? (
		<Layout
			breadcrumbItems={[
				{
					text: t('users.settings'),
					to: '/settings',
					isCurrentItem: true,
				},
			]}
		>
			<List>
				<ListItem
					secondaryAction={
						<IconButton edge="end">
							<LaunchIcon />
						</IconButton>
					}
					disablePadding
				>
					<ListItemButton
						component="a"
						href="http://gravatar.com/emails/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ListItemIcon>
							<PhotoCameraIcon />
						</ListItemIcon>
						<ListItemText primary={t('users.photo')} />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton onClick={toggleChangeUsernameDialogOpen}>
						<ListItemIcon>
							<AccountCircleIcon />
						</ListItemIcon>
						<ListItemText primary={t('auth.username')} />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton onClick={toggleChangeEmailDialogOpen}>
						<ListItemIcon>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText primary={t('auth.email')} />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton onClick={toggleChangePasswordDialogOpen}>
						<ListItemIcon>
							<LockIcon />
						</ListItemIcon>
						<ListItemText primary={t('auth.password')} />
					</ListItemButton>
				</ListItem>
			</List>

			{changeUsernameDialogOpen && (
				<ChangeUsernameDialog
					user={auth.user}
					onClose={toggleChangeUsernameDialogOpen}
					onSuccess={(user): void => {
						toggleChangeUsernameDialogOpen();

						auth.setUser(user);
					}}
				/>
			)}

			{changeEmailDialogOpen && (
				<ChangeEmailDialog
					onClose={toggleChangeEmailDialogOpen}
					onSuccess={(user): void => {
						toggleChangeEmailDialogOpen();

						auth.setUser(user);
					}}
				/>
			)}

			{changePasswordDialogOpen && (
				<ChangePasswordDialog
					onClose={toggleChangePasswordDialogOpen}
					onSuccess={(user): void => {
						toggleChangePasswordDialogOpen();

						auth.setUser(user);
					}}
				/>
			)}
		</Layout>
	) : (
		<Navigate to="/" />
	);
};

export default SettingsIndex;
