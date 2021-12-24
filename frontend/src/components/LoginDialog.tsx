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
	Grid,
	InputAdornment,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUserObject } from '../dto/users/IUserObject';
import { LoginDialogStore } from '../stores/LoginDialogStore';

interface ILoginDialogProps {
	onClose: () => void;
	onLoginComplete: (user: IUserObject) => void;
}

const LoginDialog = observer(
	({ onClose, onLoginComplete }: ILoginDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new LoginDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const user = await store.submit();

						onLoginComplete(user);
					}}
				>
					<DialogTitle>{t('auth.dialogTitle')}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<DialogContentText>
									{t('auth.dialogSubtitle')}
								</DialogContentText>
							</Grid>

							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<TextField
										autoFocus
										margin="dense"
										id="email"
										label={t('auth.email')}
										type="email"
										variant="standard"
										value={store.email}
										onChange={(e): void =>
											store.setEmail(e.target.value)
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
							</Grid>

							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<TextField
										margin="dense"
										id="password"
										label={t('auth.password')}
										type="password"
										variant="standard"
										value={store.password}
										onChange={(e): void =>
											store.setPassword(e.target.value)
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
							</Grid>
						</Grid>
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
