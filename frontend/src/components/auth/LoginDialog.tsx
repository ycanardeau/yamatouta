import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	InputAdornment,
	Stack,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IAuthenticatedUserObject } from '../../dto/users/IAuthenticatedUserObject';
import { LoginDialogStore } from '../../stores/LoginDialogStore';

interface ILoginDialogProps {
	onClose: () => void;
	onLoginComplete: (user: IAuthenticatedUserObject) => void;
}

const LoginDialog = observer(
	({ onClose, onLoginComplete }: ILoginDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new LoginDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (event): Promise<void> => {
						event.preventDefault();

						const user = await store.submit();

						onLoginComplete(user);
					}}
				>
					<DialogTitle>{t('auth.loginDialogTitle')}</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<DialogContentText>
								{t('auth.loginDialogSubtitle')}
							</DialogContentText>

							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									id="email"
									label={t('auth.email')}
									type="email"
									variant="standard"
									value={store.email}
									onChange={(event): void =>
										store.setEmail(event.target.value)
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<EmailIcon />
											</InputAdornment>
										),
									}}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<TextField
									margin="dense"
									id="password"
									label={t('auth.password')}
									type="password"
									variant="standard"
									value={store.password}
									onChange={(event): void =>
										store.setPassword(event.target.value)
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockIcon />
											</InputAdornment>
										),
									}}
								/>
							</FormControl>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>{t('shared.cancel')}</Button>
						<Button
							type="submit"
							disabled={!store.isValid || store.submitting}
						>
							{t('auth.logIn')}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default LoginDialog;
