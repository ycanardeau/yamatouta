import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
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
					onSubmit={async (event): Promise<void> => {
						event.preventDefault();

						const translation = await store.submit();

						onCreateTranslationComplete(translation);
					}}
				>
					<DialogTitle>{t('translations.addWord')}</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<FormControl variant="standard" fullWidth>
								<TextField
									autoFocus
									margin="dense"
									id="headword"
									label={t('translations.headword')}
									type="text"
									variant="standard"
									value={store.headword}
									onChange={(event): void =>
										store.setHeadword(event.target.value)
									}
								/>
							</FormControl>

							{store.isJapanese && (
								<FormControl variant="standard" fullWidth>
									<TextField
										margin="dense"
										id="reading"
										label={t('translations.reading')}
										type="text"
										variant="standard"
										value={store.reading}
										onChange={(event): void =>
											store.setReading(event.target.value)
										}
									/>
								</FormControl>
							)}

							<FormControl variant="standard" fullWidth>
								<TextField
									margin="dense"
									id="yamatokotoba"
									label={t('translations.yamatokotoba')}
									type="text"
									variant="standard"
									value={store.yamatokotoba}
									onChange={(event): void =>
										store.setYamatokotoba(
											event.target.value,
										)
									}
								/>
							</FormControl>

							<FormControl variant="standard" fullWidth>
								<InputLabel id="category" shrink>
									{t('translations.category')}
								</InputLabel>
								<Select
									labelId="category"
									id="category"
									value={store.category ?? ''}
									onChange={(event): void =>
										store.setCategory(
											event.target.value as WordCategory,
										)
									}
									displayEmpty
								>
									<MenuItem value="">
										{t('wordCategoryNames.unspecified')}
									</MenuItem>
									{Object.values(WordCategory).map(
										(value) => (
											<MenuItem key={value} value={value}>
												{t(
													`wordCategoryNames.${value}`,
												)}
											</MenuItem>
										),
									)}
								</Select>
							</FormControl>
						</Stack>
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
