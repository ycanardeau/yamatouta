import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listWorkRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IRevisionObject } from '../../dto/revisions/IRevisionObject';
import { IWorkObject } from '../../dto/works/IWorkObject';

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

interface WorkHistoryProps {
	work: IWorkObject;
}

const WorkHistory = ({ work }: WorkHistoryProps): React.ReactElement | null => {
	const [model, setModel] =
		React.useState<{ revisions: IRevisionObject[] }>();

	React.useEffect(() => {
		listWorkRevisions({ workId: work.id }).then((result) =>
			setModel({ revisions: result.items }),
		);
	}, [work]);

	return model ? <Layout revisions={model.revisions} /> : null;
};

export default WorkHistory;
