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

import { IAuthenticatedUserObject } from '../../dto/users/IAuthenticatedUserObject';
import { ChangeEmailDialogStore } from '../../stores/settings/ChangeEmailDialogStore';

interface IChangeEmailDialogProps {
	onClose: () => void;
	onChangeEmailComplete: (user: IAuthenticatedUserObject) => void;
}

const ChangeEmailDialog = observer(
	({
		onClose,
		onChangeEmailComplete,
	}: IChangeEmailDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new ChangeEmailDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const user = await store.submit();

						onChangeEmailComplete(user);
					}}
				>
					<DialogTitle>
						{t('settings.changeEmailDialogTitle')}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<DialogContentText>
								{t('settings.changeEmailDialogSubtitle')}
							</DialogContentText>

							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									label={t('auth.email')}
									type="email"
									variant="standard"
									value={store.email}
									onChange={(e): void =>
										store.setEmail(e.target.value)
									}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<TextField
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

export default ChangeEmailDialog;
