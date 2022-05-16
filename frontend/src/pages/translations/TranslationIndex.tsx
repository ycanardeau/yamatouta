import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import TranslationCreateDialog from '../../components/translations/TranslationCreateDialog';
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

	const translationCreateDialog = useDialog();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.words')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={translationCreateDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateTranslations,
							)
						}
						iconType={AddRegular}
					>
						{t('translations.addWord')}
					</EuiButton>,
				]}
			/>

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<TranslationSearchOptions store={store} />

					<EuiSpacer size="m" />

					<TranslationSearchTable store={store} />

					{translationCreateDialog.visible && (
						<TranslationCreateDialog
							onClose={translationCreateDialog.close}
							onSuccess={(translation): void =>
								navigate(`/translations/${translation.id}/edit`)
							}
						/>
					)}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default TranslationIndex;
