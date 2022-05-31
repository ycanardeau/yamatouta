import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { workApi } from '../../api/workApi';
import { RevisionComment } from '../../components/revisions/RevisionComment';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { WorkPage } from '../../components/works/WorkPage';
import { useWorkDetails } from '../../components/works/useWorkDetails';
import { IRevisionObject } from '../../dto/IRevisionObject';
import { IWorkObject } from '../../dto/IWorkObject';

interface LayoutProps {
	work: IWorkObject;
	revisions: IRevisionObject[];
}

const Layout = ({ work, revisions }: LayoutProps): React.ReactElement => {
	const title = work.name;

	useYamatoutaTitle(title, true);

	return (
		<WorkPage work={work} pageHeaderProps={{ pageTitle: title }}>
			<EuiCommentList>
				{revisions.map((revision, index) => (
					<RevisionComment revision={revision} key={index} />
				))}
			</EuiCommentList>
		</WorkPage>
	);
};

const WorkHistory = (): React.ReactElement | null => {
	const [work] = useWorkDetails(React.useCallback((work) => work, []));

	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		if (!work) return;

		workApi
			.listRevisions({ id: work.id })
			.then((result) => setRevisions(result.items));
	}, [work]);

	return work && revisions ? (
		<Layout work={work} revisions={revisions} />
	) : null;
};

export default WorkHistory;
