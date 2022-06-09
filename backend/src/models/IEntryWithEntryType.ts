import { EntryType } from './EntryType';

export interface IEntryWithEntryType<TEntryType extends EntryType> {
	entryType: TEntryType;
}
