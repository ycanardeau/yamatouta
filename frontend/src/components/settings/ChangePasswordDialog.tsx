import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	Stack,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChangePasswordDialogStore } from '../../stores/settings/ChangePasswordDialogStore';

interface IChangePasswordDialogProps {
	onClose: () => void;
}

const ChangePasswordDialog = observer(
	({ onClose }: IChangePasswordDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ChangePasswordDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						await store.submit();
					}}
				>
					<DialogTitle>
						{t('settings.changePasswordDialogTitle')}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<DialogContentText>
								{t('settings.changePasswordDialogSubtitle')}
							</DialogContentText>

							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									label={t('settings.currentPassword')}
									type="password"
									variant="standard"
									value={store.currentPassword}
									onChange={(e): void =>
										store.setCurrentPassword(e.target.value)
									}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<TextField
									margin="dense"
									label={t('settings.newPassword')}
									type="password"
									variant="standard"
									value={store.newPassword}
									onChange={(e): void =>
										store.setNewPassword(e.target.value)
									}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<TextField
									margin="dense"
									label={t('settings.confirmNewPassword')}
									type="password"
									variant="standard"
									value={store.confirmNewPassword}
									onChange={(e): void =>
										store.setConfirmNewPassword(
											e.target.value,
										)
									}
								/>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>{t('shared.cancel')}</Button>
						<Button type="submit" disabled={!store.isValid}>
							{t('shared.done')}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default ChangePasswordDialog;
