import { EntryType } from './EntryType';

export interface IEntryWithEntryType<TEntryType extends EntryType> {
	id: number;
	entryType: TEntryType;
}
