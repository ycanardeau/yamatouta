import React from 'react';
import { useTranslation } from 'react-i18next';

import { TranslationEditForm } from '../../components/translations/TranslationEditForm';
import { TranslationPage } from '../../components/translations/TranslationPage';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';

const TranslationCreate = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const title = t('translations.addWord');

	useYamatoutaTitle(title, ready);

	return (
		<TranslationPage pageHeaderProps={{ pageTitle: title }}>
			<TranslationEditForm />
		</TranslationPage>
	);
};

export default TranslationCreate;
