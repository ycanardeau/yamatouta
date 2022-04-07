import { EuiComment, EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui';
import {
	AddCircleRegular,
	DeleteRegular,
	EditRegular,
} from '@fluentui/react-icons';
import moment from 'moment';
import React from 'react';

import Avatar from '../../components/Avatar';
import { IRevisionObject } from '../../dto/revisions/IRevisionObject';
import { RevisionEvent } from '../../models/RevisionEvent';

interface TimelineIconProps {
	event: RevisionEvent;
}

const TimelineIcon = ({ event }: TimelineIconProps): React.ReactElement => {
	switch (event) {
		case RevisionEvent.Created:
			return <EuiIcon type={AddCircleRegular} />;

		case RevisionEvent.Updated:
			return <EuiIcon type={EditRegular} />;

		case RevisionEvent.Deleted:
			return <EuiIcon type={DeleteRegular} />;
	}
};

interface RevisionCommentProps {
	revision: IRevisionObject;
}

const RevisionComment = ({
	revision,
}: RevisionCommentProps): React.ReactElement => {
	return (
		<EuiComment
			username={
				<EuiFlexGroup
					responsive={false}
					alignItems="center"
					gutterSize="s"
				>
					<EuiFlexItem grow={false}>
						<Avatar
							size="s"
							name={revision.actor.name}
							imageUrl={revision.actor.avatarUrl}
						/>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						{revision.actor.name}
					</EuiFlexItem>
				</EuiFlexGroup>
			}
			type="update"
			event={
				<EuiFlexGroup
					responsive={false}
					alignItems="center"
					gutterSize="s"
				>
					<EuiFlexItem grow={false}>{revision.event}</EuiFlexItem>
				</EuiFlexGroup>
			}
			timestamp={moment(revision.createdAt).fromNow()}
			timelineIcon={<TimelineIcon event={revision.event} />}
		/>
	);
};

export default RevisionComment;