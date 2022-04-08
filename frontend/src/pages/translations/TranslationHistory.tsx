import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listTranslationRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IRevisionObject } from '../../dto/revisions/IRevisionObject';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';

interface LayoutProps {
	revisions: IRevisionObject[];
}

const Layout = ({ revisions }: LayoutProps): React.ReactElement => {
	return (
		<EuiCommentList>
			{revisions.map((revision, index) => (
				<RevisionComment key={index} revision={revision} />
			))}
		</EuiCommentList>
	);
};

interface TranslationHistoryProps {
	translation: ITranslationObject;
}

const TranslationHistory = ({
	translation,
}: TranslationHistoryProps): React.ReactElement | null => {
	const [model, setModel] =
		React.useState<{ revisions: IRevisionObject[] }>();

	React.useEffect(() => {
		listTranslationRevisions({ translationId: translation.id }).then(
			(result) => setModel({ revisions: result.items }),
		);
	}, [translation]);

	return model ? <Layout revisions={model.revisions} /> : null;
};

export default TranslationHistory;
