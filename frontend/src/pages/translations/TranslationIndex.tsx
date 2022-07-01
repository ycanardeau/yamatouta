import { EuiButton, EuiSpacer } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TranslationPage } from '../../components/translations/TranslationPage';
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
		<TranslationPage
			pageHeaderProps={{
				pageTitle: t('shared.words'),
				rightSideItems: [
					<EuiButton
						size="s"
						href="/translations/create"
						onClick={(e: any): void => {
							e.preventDefault();
							navigate('/translations/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateTranslations,
							)
						}
						iconType={AddRegular}
					>
						{t('translations.addWord')}
					</EuiButton>,
				],
			}}
		>
			<TranslationSearchOptions store={store} />

			<EuiSpacer size="m" />

			<TranslationSearchTable store={store} />
		</TranslationPage>
	);
});

export default TranslationIndex;
