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

const SettingsIndex = (): React.ReactElement => {
	const { t } = useTranslation();

	const [changeEmailDialogOpen, setChangeEmailDialogOpen] =
		React.useState(false);

	const toggleChangeEmailDialogOpen = (): void =>
		setChangeEmailDialogOpen(!changeEmailDialogOpen);

	const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
		React.useState(false);

	const toggleChangePasswordDialogOpen = (): void =>
		setChangePasswordDialogOpen(!changePasswordDialogOpen);

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
				<ChangeEmailDialog onClose={toggleChangeEmailDialogOpen} />
			)}

			{changePasswordDialogOpen && (
				<ChangePasswordDialog
					onClose={toggleChangePasswordDialogOpen}
				/>
			)}
		</Layout>
	);
};

export default SettingsIndex;
