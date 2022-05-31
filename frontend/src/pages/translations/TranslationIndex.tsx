import {
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TranslationBreadcrumbs } from '../../components/translations/TranslationBreadcrumbs';
import { TranslationSearchOptions } from '../../components/translations/TranslationSearchOptions';
import { TranslationSearchTable } from '../../components/translations/TranslationSearchTable';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { TranslationSearchStore } from '../../stores/translations/TranslationSearchStore';

const TranslationIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new TranslationSearchStore());

	useYamatoutaTitle(t('shared.words'), ready);

	useStoreWithPagination(store);

	const auth = useAuth();

	const navigate = useNavigate();

	return (
		<>
			<TranslationBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.words')}
				rightSideItems={[
					<EuiButton
						size="s"
						href="/translations/create"
						onClick={(e: any): void => {
							e.preventDefault();
							navigate('/translations/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Translation_Create,
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
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default TranslationIndex;
