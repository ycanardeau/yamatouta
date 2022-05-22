import {
	EuiCommentList,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiPageHeaderProps,
	EuiSpacer,
} from '@elastic/eui';

import { IWorkObject } from '../../dto/IWorkObject';
import WorkBreadcrumbs from './WorkBreadcrumbs';

interface WorkPageProps {
	work?: IWorkObject;
	pageHeaderProps?: EuiPageHeaderProps;
	children?: React.ReactNode;
}

const WorkPage = ({
	work,
	pageHeaderProps,
	children,
}: WorkPageProps): React.ReactElement => {
	return (
		<>
			<WorkBreadcrumbs work={work} />
			<EuiSpacer size="xs" />
			<EuiPageHeader {...pageHeaderProps} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<EuiCommentList>{children}</EuiCommentList>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default WorkPage;
