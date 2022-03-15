import { Collection } from '@mikro-orm/core';

import { ChangeLogEntry } from '../entities/ChangeLogEntry';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { ChangeLogEvent } from './ChangeLogEvent';
import { EntryDiff } from './EntryDiff';

export interface IEntryWithChangeLogEntries<TEntryDiff extends EntryDiff> {
	changeLogEntries: Collection<ChangeLogEntry<TEntryDiff>>;

	createChangeLogEntry({}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
	}): ChangeLogEntry<TEntryDiff>;
}
