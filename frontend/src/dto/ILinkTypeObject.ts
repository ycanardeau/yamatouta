import { EntryType } from '../models/EntryType';

export interface ILinkTypeObject {
	id: number;
	entryType: EntryType;
	relatedEntryType: EntryType;
	name: string;
}
