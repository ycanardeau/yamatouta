import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../components/layout/Layout';
import ChangeEmailDialog from '../../components/settings/ChangeEmailDialog';
import ChangePasswordDialog from '../../components/settings/ChangePasswordDialog';
import { useAuth } from '../../components/useAuth';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';

const SettingsIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('users.settings'), ready);

	const [changeEmailDialogOpen, setChangeEmailDialogOpen] =
		React.useState(false);

	const toggleChangeEmailDialogOpen = (): void =>
		setChangeEmailDialogOpen(!changeEmailDialogOpen);

	const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
		React.useState(false);

	const toggleChangePasswordDialogOpen = (): void =>
		setChangePasswordDialogOpen(!changePasswordDialogOpen);

	const auth = useAuth();

	return (
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

			{changeEmailDialogOpen && (
				<ChangeEmailDialog
					onClose={toggleChangeEmailDialogOpen}
					onChangeEmailComplete={(user): void => {
						toggleChangeEmailDialogOpen();

						auth.setUser(user);
					}}
				/>
			)}

			{changePasswordDialogOpen && (
				<ChangePasswordDialog
					onClose={toggleChangePasswordDialogOpen}
					onChangePasswordComplete={(user): void => {
						toggleChangePasswordDialogOpen();

						auth.setUser(user);
					}}
				/>
			)}
		</Layout>
	);
};

export default SettingsIndex;
