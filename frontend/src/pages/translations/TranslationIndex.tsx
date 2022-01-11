import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CreateTranslationDialog from '../../components/CreateTranslationDialog';
import Pagination from '../../components/Pagination';
import TranslationList from '../../components/TranslationList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
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
		>
			<Pagination store={store.paginationStore} />

			<TranslationList translations={store.translations} />

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
