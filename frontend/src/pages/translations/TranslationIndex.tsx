import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CreateTranslationDialog from '../../components/CreateTranslationDialog';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import Layout from '../Layout';

const TranslationIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('shared.words'), ready);

	const [createTranslationDialogOpen, setCreateTranslationDialogOpen] =
		React.useState(false);

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
			{createTranslationDialogOpen && (
				<CreateTranslationDialog
					onClose={(): void => setCreateTranslationDialogOpen(false)}
				/>
			)}
		</Layout>
	);
};

export default TranslationIndex;
