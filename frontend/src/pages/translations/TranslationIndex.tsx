import AddCircleIcon from '@mui/icons-material/AddCircle';
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

import Layout from '../../components/layout/Layout';
import CreateTranslationDialog from '../../components/translations/CreateTranslationDialog';
import TranslationSearchTable from '../../components/translations/TranslationSearchTable';
import { useAuth } from '../../components/useAuth';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { TranslationSortRule } from '../../models/TranslationSortRule';
import { WordCategory } from '../../models/WordCategory';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';

interface TranslationIndexSidebarProps {
	store: TranslationSearchStore;
}

const TranslationIndexSidebar = observer(
	({ store }: TranslationIndexSidebarProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
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
							store.setCategory(e.target.value as WordCategory)
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

				<FormControl variant="standard" fullWidth>
					<InputLabel id="sort" shrink>
						{t('translations.sortBy')}
					</InputLabel>
					<Select
						labelId="sort"
						id="sort"
						value={store.sort ?? ''}
						onChange={(e): void =>
							store.setSort(e.target.value as TranslationSortRule)
						}
						displayEmpty
					>
						{Object.values(TranslationSortRule).map((value) => (
							<MenuItem key={value} value={value}>
								{t(`translationSortRuleNames.${value}`)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>
		);
	},
);

const TranslationIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new TranslationSearchStore());

	useYamatoutaTitle(t('shared.words'), ready);

	useStoreWithPagination(store);

	const [createTranslationDialogOpen, setCreateTranslationDialogOpen] =
		React.useState(false);

	const navigate = useNavigate();

	const auth = useAuth();

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
					startIcon={<AddCircleIcon />}
					disabled={
						!auth.permissionContext.hasPermission(
							Permission.CreateTranslations,
						)
					}
				>
					{t('translations.addWord')}
				</Button>
			}
			sidebar={<TranslationIndexSidebar store={store} />}
		>
			<TranslationSearchTable store={store} />

			{createTranslationDialogOpen && (
				<CreateTranslationDialog
					onClose={(): void => setCreateTranslationDialogOpen(false)}
					onSuccess={(translation): void => {
						setCreateTranslationDialogOpen(false);

						navigate(`/translations/${translation.id}`);
					}}
				/>
			)}
		</Layout>
	);
});

export default TranslationIndex;
