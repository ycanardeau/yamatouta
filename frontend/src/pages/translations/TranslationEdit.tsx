import { TranslationEditForm } from '@/components/translations/TranslationEditForm';
import { TranslationPage } from '@/components/translations/TranslationPage';
import { useTranslationDetails } from '@/components/translations/useTranslationDetails';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { TranslationEditDto } from '@/dto/TranslationEditDto';
import React from 'react';

interface LayoutProps {
	translation: TranslationEditDto;
}

const Layout = ({ translation }: LayoutProps): React.ReactElement => {
	const title = `${translation.headword} ↔ ${translation.yamatokotoba}`;

	useYamatoutaTitle(title, true);

	return (
		<TranslationPage
			translation={translation}
			pageHeaderProps={{ pageTitle: title }}
		>
			<TranslationEditForm translation={translation} />
		</TranslationPage>
	);
};

const TranslationEdit = (): React.ReactElement | null => {
	const [translation] = useTranslationDetails(
		React.useCallback(
			(translation) => translation as TranslationEditDto,
			[],
		),
	);

	return translation ? <Layout translation={translation} /> : null;
};

export default TranslationEdit;
