import { Link } from '@/components/Link';
import { IWorkLinkDto } from '@/dto/ILinkDto';
import {
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';

interface WorkLinkListProps {
	workLinks: IWorkLinkDto[];
}

const WorkLinkList = ({ workLinks }: WorkLinkListProps): React.ReactElement => {
	return (
		<>
			{workLinks.map((workLink, index) => (
				<React.Fragment key={workLink.id}>
					{index > 0 && <br />}
					<Link to={`/works/${workLink.relatedWork.id}`}>
						{workLink.relatedWork.name}
					</Link>
				</React.Fragment>
			))}
		</>
	);
};

interface WorkLinkDescriptionListProps {
	title: string;
	workLinks: IWorkLinkDto[];
}

export const WorkLinkDescriptionList = ({
	title,
	workLinks,
}: WorkLinkDescriptionListProps): React.ReactElement => {
	return (
		<>
			<EuiDescriptionListTitle>{title}</EuiDescriptionListTitle>
			<EuiDescriptionListDescription>
				<WorkLinkList workLinks={workLinks} />
			</EuiDescriptionListDescription>
		</>
	);
};
