import { EuiIcon, EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import { KeyRegular, MailRegular, PersonRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { ChangeEmailDialog } from '../../components/settings/ChangeEmailDialog';
import { ChangePasswordDialog } from '../../components/settings/ChangePasswordDialog';
import { ChangeUsernameDialog } from '../../components/settings/ChangeUsernameDialog';
import { useAuth } from '../../components/useAuth';
import { useDialog } from '../../components/useDialog';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';

const SettingsIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('users.settings'), ready);

	const auth = useAuth();

	const changeUsernameDialog = useDialog();
	const changeEmailDialog = useDialog();
	const changePasswordDialog = useDialog();

	return auth.user ? (
		<>
			<EuiListGroup>
				<EuiListGroupItem
					icon={<EuiIcon type={PersonRegular} />}
					label={t('auth.username')}
					onClick={changeUsernameDialog.show}
					isActive
				/>
				<EuiListGroupItem
					icon={<EuiIcon type={MailRegular} />}
					label={t('auth.email')}
					onClick={changeEmailDialog.show}
					isActive
				/>
				<EuiListGroupItem
					icon={<EuiIcon type={KeyRegular} />}
					label={t('auth.password')}
					onClick={changePasswordDialog.show}
					isActive
				/>
			</EuiListGroup>

			{changeUsernameDialog.visible && (
				<ChangeUsernameDialog
					user={auth.user}
					onClose={changeUsernameDialog.close}
					onSuccess={(user): void => auth.setUser(user)}
				/>
			)}

			{changeEmailDialog.visible && (
				<ChangeEmailDialog
					onClose={changeEmailDialog.close}
					onSuccess={(user): void => auth.setUser(user)}
				/>
			)}

			{changePasswordDialog.visible && (
				<ChangePasswordDialog
					onClose={changePasswordDialog.close}
					onSuccess={(user): void => auth.setUser(user)}
				/>
			)}
		</>
	) : (
		<Navigate to="/" replace />
	);
};

export default SettingsIndex;
