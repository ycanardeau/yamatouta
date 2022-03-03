import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CreateTranslationDialog from '../../components/translations/CreateTranslationDialog';
import TranslationSearchOptions from '../../components/translations/TranslationSearchOptions';
import TranslationSearchTable from '../../components/translations/TranslationSearchTable';
import { useAuth } from '../../components/useAuth';
import { useDialog } from '../../components/useDialog';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';

const Breadcrumbs = (): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.words'),
			href: '/translations',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/translations');
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const TranslationIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new TranslationSearchStore());

	useYamatoutaTitle(t('shared.words'), ready);

	useStoreWithPagination(store);

	const auth = useAuth();

	const navigate = useNavigate();

	const createTranslationDialog = useDialog();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.words')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={createTranslationDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateTranslations,
							)
						}
					>
						{t('translations.addWord')}
					</EuiButton>,
				]}
			/>

			<TranslationSearchOptions store={store} />

			<EuiSpacer size="m" />

			<TranslationSearchTable store={store} />

			{createTranslationDialog.visible && (
				<CreateTranslationDialog
					onClose={createTranslationDialog.close}
					onSuccess={(translation): void =>
						navigate(`/translations/${translation.id}`)
					}
				/>
			)}
		</>
	);
});

export default TranslationIndex;
