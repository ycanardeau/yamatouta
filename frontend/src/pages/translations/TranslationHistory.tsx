import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listTranslationRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IRevisionObject } from '../../dto/IRevisionObject';
import { ITranslationObject } from '../../dto/ITranslationObject';

interface LayoutProps {
	revisions: IRevisionObject[];
}

const Layout = ({ revisions }: LayoutProps): React.ReactElement => {
	return (
		<EuiCommentList>
			{revisions.map((revision, index) => (
				<RevisionComment revision={revision} key={index} />
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
	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		listTranslationRevisions({ translationId: translation.id }).then(
			(result) => setRevisions(result.items),
		);
	}, [translation]);

	return revisions ? <Layout revisions={revisions} /> : null;
};

export default TranslationHistory;
