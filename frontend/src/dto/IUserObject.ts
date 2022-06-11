import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';

export interface IUserObject extends IEntryWithEntryType<EntryType.User> {
	id: number;
	name: string;
	avatarUrl: string;
}
