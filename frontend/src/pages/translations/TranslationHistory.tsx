import { translationApi } from '@/api/translationApi';
import { RevisionComment } from '@/components/revisions/RevisionComment';
import { TranslationPage } from '@/components/translations/TranslationPage';
import { useTranslationDetails } from '@/components/translations/useTranslationDetails';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { EuiCommentList } from '@elastic/eui';
import React from 'react';

interface LayoutProps {
	translation: ITranslationDto;
	revisions: IRevisionDto[];
}

const Layout = ({
	translation,
	revisions,
}: LayoutProps): React.ReactElement => {
	const title = `${translation.headword} ↔ ${translation.yamatokotoba}`;

	useYamatoutaTitle(title, true);

	return (
		<TranslationPage
			translation={translation}
			pageHeaderProps={{ pageTitle: title }}
		>
			<EuiCommentList>
				{revisions.map((revision, index) => (
					<RevisionComment revision={revision} key={index} />
				))}
			</EuiCommentList>
		</TranslationPage>
	);
};

const TranslationHistory = (): React.ReactElement | null => {
	const [translation] = useTranslationDetails(
		React.useCallback((translation) => translation, []),
	);

	const [revisions, setRevisions] = React.useState<IRevisionDto[]>();

	React.useEffect(() => {
		if (!translation) return;

		translationApi
			.listRevisions({ id: translation.id })
			.then((result) => setRevisions(result.items));
	}, [translation]);

	return translation && revisions ? (
		<Layout translation={translation} revisions={revisions} />
	) : null;
};

export default TranslationHistory;
