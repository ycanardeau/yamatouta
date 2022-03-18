import { ChangeLogChange } from '../src/entities/ChangeLogChange';
import { ChangeLogEntry } from '../src/entities/ChangeLogEntry';
import { Revision } from '../src/entities/Revision';
import { User } from '../src/entities/User';
import { ChangeLogEvent } from '../src/models/ChangeLogEvent';
import { EntryDiff } from '../src/models/EntryDiff';

export const testChangeLogEntry = (
	actual: ChangeLogEntry<EntryDiff>,
	{
		revision,
		actor,
		actionType,
		changes,
	}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		changes: Record<string, string>;
	},
): void => {
	const entries = Object.entries(changes);

	expect(actual.revision.getEntity()).toBe(revision);
	expect(actual.changes.length).toBe(entries.length);
	expect(actual.actor).toBe(actor);
	expect(actual.actionType).toBe(actionType);

	for (let i = 0; i < actual.changes.length; i++) {
		const changeLogChange = actual.changes[i];
		expect(changeLogChange).toBeInstanceOf(ChangeLogChange);
		expect(changeLogChange.changeLogEntry).toBe(actual);

		const [key, value] = entries[i];
		expect(changeLogChange.key).toBe(key);
		expect(changeLogChange.value).toBe(value);
	}
};
