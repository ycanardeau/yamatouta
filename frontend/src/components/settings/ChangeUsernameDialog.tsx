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
import { ChangeUsernameDialogStore } from '../../stores/settings/ChangeUsernameDialogStore';

interface IChangeUsernameDialogProps {
	user: IAuthenticatedUserObject;
	onClose: () => void;
	onChangeUsernameComplete: (user: IAuthenticatedUserObject) => void;
}

const ChangeUsernameDialog = observer(
	({
		user,
		onClose,
		onChangeUsernameComplete,
	}: IChangeUsernameDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new ChangeUsernameDialogStore(user),
		);

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const user = await store.submit();

						onChangeUsernameComplete(user);
					}}
				>
					<DialogTitle>
						{t('settings.changeUsernameDialogTitle')}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<DialogContentText>
								{t('settings.changeUsernameDialogSubtitle')}
							</DialogContentText>

							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									label={t('auth.username')}
									type="text"
									variant="standard"
									value={store.username}
									onChange={(e): void =>
										store.setUsername(e.target.value)
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

export default ChangeUsernameDialog;
