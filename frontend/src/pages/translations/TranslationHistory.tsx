import {
	EuiComment,
	EuiCommentList,
	EuiFlexGroup,
	EuiFlexItem,
	EuiIcon,
} from '@elastic/eui';
import {
	AddCircleRegular,
	DeleteRegular,
	EditRegular,
} from '@fluentui/react-icons';
import moment from 'moment';
import React from 'react';

import { listTranslationRevisions } from '../../api/TranslationApi';
import Avatar from '../../components/Avatar';
import { IChangeLogEntryObject } from '../../dto/IChangeLogEntryObject';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { ChangeLogEvent } from '../../models/ChangeLogEvent';

interface TimelineIconProps {
	actionType: ChangeLogEvent;
}

const TimelineIcon = ({
	actionType,
}: TimelineIconProps): React.ReactElement => {
	switch (actionType) {
		case ChangeLogEvent.Created:
			return <EuiIcon type={AddCircleRegular} />;

		case ChangeLogEvent.Updated:
			return <EuiIcon type={EditRegular} />;

		case ChangeLogEvent.Deleted:
			return <EuiIcon type={DeleteRegular} />;
	}
};

interface ChangeLogEntryProps {
	changeLogEntry: IChangeLogEntryObject;
}

const ChangeLogEntry = ({
	changeLogEntry,
}: ChangeLogEntryProps): React.ReactElement => {
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
							name={changeLogEntry.actor.name}
							imageUrl={changeLogEntry.actor.avatarUrl}
						/>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						{changeLogEntry.actor.name}
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
					<EuiFlexItem grow={false}>
						{changeLogEntry.actionType}
					</EuiFlexItem>
				</EuiFlexGroup>
			}
			timestamp={moment(changeLogEntry.createdAt).fromNow()}
			timelineIcon={
				<TimelineIcon actionType={changeLogEntry.actionType} />
			}
		/>
	);
};

interface LayoutProps {
	translation: ITranslationObject;
	changeLogEntries: IChangeLogEntryObject[];
}

const Layout = ({ changeLogEntries }: LayoutProps): React.ReactElement => {
	return (
		<EuiCommentList>
			{changeLogEntries.map((changeLogEntry, index) => (
				<ChangeLogEntry key={index} changeLogEntry={changeLogEntry} />
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
		React.useState<{ changeLogEntries: IChangeLogEntryObject[] }>();

	React.useEffect(() => {
		listTranslationRevisions({ translationId: translation.id }).then(
			(result) => setModel({ changeLogEntries: result.items }),
		);
	}, [translation]);

	return model ? (
		<Layout
			translation={translation}
			changeLogEntries={model.changeLogEntries}
		/>
	) : null;
};

export default TranslationHistory;
