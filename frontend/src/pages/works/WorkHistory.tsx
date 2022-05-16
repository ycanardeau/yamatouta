import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listWorkRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IRevisionObject } from '../../dto/IRevisionObject';
import { IWorkObject } from '../../dto/IWorkObject';

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

interface WorkHistoryProps {
	work: IWorkObject;
}

const WorkHistory = ({ work }: WorkHistoryProps): React.ReactElement | null => {
	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		listWorkRevisions({ workId: work.id }).then((result) =>
			setRevisions(result.items),
		);
	}, [work]);

	return revisions ? <Layout revisions={revisions} /> : null;
};

export default WorkHistory;
