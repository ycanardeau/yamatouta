import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { WorkEditForm } from '@/components/works/WorkEditForm';
import { WorkPage } from '@/components/works/WorkPage';
import { useWorkDetails } from '@/components/works/useWorkDetails';
import { WorkEditDto } from '@/dto/WorkEditDto';
import React from 'react';

interface LayoutProps {
	work: WorkEditDto;
}

const Layout = ({ work }: LayoutProps): React.ReactElement => {
	const title = work.name;

	useYamatoutaTitle(title, true);

	return (
		<WorkPage work={work} pageHeaderProps={{ pageTitle: title }}>
			<WorkEditForm work={work} />
		</WorkPage>
	);
};

const WorkEdit = (): React.ReactElement | null => {
	const [work] = useWorkDetails(
		React.useCallback((work) => work as WorkEditDto, []),
	);

	return work ? <Layout work={work} /> : null;
};

export default WorkEdit;
