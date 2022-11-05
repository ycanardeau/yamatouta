import { EntryType } from '@/models/EntryType';

export interface IEntryWithEntryType<TEntryType extends EntryType> {
	id: number;
	entryType: TEntryType;
}
