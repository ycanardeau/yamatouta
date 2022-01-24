import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CreateTranslationDialog from '../../components/CreateTranslationDialog';
import Pagination from '../../components/Pagination';
import TranslationList from '../../components/TranslationList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { WordCategory } from '../../models/WordCategory';
import { TranslationIndexStore } from '../../stores/translations/TranslationIndexStore';
import Layout from '../Layout';

const TranslationIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new TranslationIndexStore());

	useYamatoutaTitle(t('shared.words'), ready);

	useStoreWithPagination(store);

	const [createTranslationDialogOpen, setCreateTranslationDialogOpen] =
		React.useState(false);

	const navigate = useNavigate();

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('shared.words'),
					to: '/translations',
					isCurrentItem: true,
				},
			]}
			actions={
				<Button
					variant="contained"
					size="small"
					onClick={(): void => setCreateTranslationDialogOpen(true)}
				>
					{t('translations.addWord')}
				</Button>
			}
			sidebar={
				<Stack spacing={2}>
					<DebounceInput
						element={TextField}
						debounceTimeout={300}
						label={undefined}
						type="text"
						variant="standard"
						fullWidth
						placeholder={t(`translations.search`)}
						value={store.query}
						onChange={(e): void => store.setQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
							endAdornment: store.query && (
								<InputAdornment position="end">
									<IconButton
										onClick={store.clearQuery}
										onMouseDown={(e): void =>
											e.preventDefault()
										}
									>
										<ClearIcon />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

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
							{Object.values(WordCategory).map((value) => (
								<MenuItem key={value} value={value}>
									{t(`wordCategoryNames.${value}`)}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			}
		>
			<Pagination store={store.paginationStore} />

			<TranslationList
				translations={store.translations}
				sort={store.sort}
				onSortChange={(sort): void => store.setSort(sort)}
				searchWords={store.query.trim().split(/\s+/)}
			/>

			<Pagination store={store.paginationStore} />

			{createTranslationDialogOpen && (
				<CreateTranslationDialog
					onClose={(): void => setCreateTranslationDialogOpen(false)}
					onCreateTranslationComplete={(translation): void => {
						setCreateTranslationDialogOpen(false);

						navigate(`/translations/${translation.id}`);
					}}
				/>
			)}
		</Layout>
	);
});

export default TranslationIndex;
