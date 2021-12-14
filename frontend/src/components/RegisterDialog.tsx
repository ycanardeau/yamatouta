import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUserObject } from '../dto/users/IUserObject';
import { RegisterDialogStore } from '../stores/RegisterDialogStore';

interface IRegisterDialogProps {
	onClose: () => void;
	onRegisterComplete: (user: IUserObject) => void;
}

const RegisterDialog = observer(
	({
		onClose,
		onRegisterComplete,
	}: IRegisterDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(() => new RegisterDialogStore());

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const user = await store.submit();

						onRegisterComplete(user);
					}}
				>
					<DialogTitle>{t('auth.register')}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
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
									/>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<TextField
										margin="dense"
										id="username"
										label={t('auth.username')}
										type="text"
										variant="standard"
										value={store.username}
										onChange={(e): void =>
											store.setUsername(e.target.value)
										}
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
							{t('auth.register')}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default RegisterDialog;
