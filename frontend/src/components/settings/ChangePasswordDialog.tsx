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
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IChangePasswordDialogProps {
	onClose: () => void;
}

const ChangePasswordDialog = ({
	onClose,
}: IChangePasswordDialogProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<Dialog open={true} onClose={onClose} fullWidth>
			<form
				onSubmit={async (event): Promise<void> => {
					event.preventDefault();
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
							/>
						</FormControl>

						<FormControl variant="standard" fullWidth>
							<TextField
								margin="dense"
								label={t('settings.newPassword')}
								type="password"
								variant="standard"
							/>
						</FormControl>

						<FormControl variant="standard" fullWidth>
							<TextField
								margin="dense"
								label={t('settings.confirmNewPassword')}
								type="password"
								variant="standard"
							/>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>{t('shared.cancel')}</Button>
					<Button type="submit">{t('shared.done')}</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ChangePasswordDialog;
