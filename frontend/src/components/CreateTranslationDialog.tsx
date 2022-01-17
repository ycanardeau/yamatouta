import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { WordCategory } from '../models/WordCategory';
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
											store.setHeadword(e.target.value)
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
												store.setReading(e.target.value)
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
											store.setYamatokotoba(
												e.target.value,
											)
										}
									/>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<FormControl variant="standard" fullWidth>
									<InputLabel id="category" shrink>
										{t('translations.category')}
									</InputLabel>
									<Select
										labelId="category"
										id="category"
										value={store.category ?? ''}
										onChange={(e): void =>
											store.setCategory(
												e.target.value as WordCategory,
											)
										}
										displayEmpty
									>
										<MenuItem value="">
											{t('wordCategoryNames.unspecified')}
										</MenuItem>
										{Object.values(WordCategory).map(
											(value) => (
												<MenuItem
													key={value}
													value={value}
												>
													{t(
														`wordCategoryNames.${value}`,
													)}
												</MenuItem>
											),
										)}
									</Select>
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
