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
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { CreateTranslationDialogStore } from '../stores/CreateTranslationDialogStore';

interface ICreateTranslationDialogProps {
	onClose: () => void;
	onCreateTranslationComplete: (translation: ITranslationObject) => void;
}

const CreateTranslationDialog = observer(
	({
		onClose,
		onCreateTranslationComplete,
	}: ICreateTranslationDialogProps): React.ReactElement => {
		const { t } = useTranslation();

		const [store] = React.useState(
			() => new CreateTranslationDialogStore(),
		);

		return (
			<Dialog open={true} onClose={onClose} fullWidth>
				<form
					onSubmit={async (e): Promise<void> => {
						e.preventDefault();

						const translation = await store.submit();

						onCreateTranslationComplete(translation);
					}}
				>
					<DialogTitle>{t('translations.addWord')}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<TextField
										autoFocus
										margin="dense"
										id="headword"
										label={t('translations.headword')}
										type="text"
										variant="standard"
										value={store.headword}
										onChange={(e): void =>
											runInAction(() => {
												store.headword = e.target.value;
											})
										}
									/>
								</FormControl>
							</Grid>

							{store.isJapanese && (
								<Grid item xs={12}>
									<FormControl variant="standard" fullWidth>
										<TextField
											margin="dense"
											id="reading"
											label={t('translations.reading')}
											type="text"
											variant="standard"
											value={store.reading}
											onChange={(e): void =>
												runInAction(() => {
													store.reading =
														e.target.value;
												})
											}
										/>
									</FormControl>
								</Grid>
							)}

							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<TextField
										margin="dense"
										id="yamatokotoba"
										label={t('translations.yamatokotoba')}
										type="text"
										variant="standard"
										value={store.yamatokotoba}
										onChange={(e): void =>
											runInAction(() => {
												store.yamatokotoba =
													e.target.value;
											})
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
							{t('translations.addWord')}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default CreateTranslationDialog;
