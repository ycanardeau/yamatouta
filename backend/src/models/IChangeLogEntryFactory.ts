import { ChangeLogEntry } from '../entities/ChangeLogEntry';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { ChangeLogEvent } from './ChangeLogEvent';
import { EntryDiff } from './EntryDiff';

export interface IChangeLogEntryFactory<TEntryDiff extends EntryDiff> {
	createChangeLogEntry({}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
	}): ChangeLogEntry<TEntryDiff>;
}
