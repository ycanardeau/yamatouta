import { ChangeLogEvent } from '../models/ChangeLogEvent';
import { EntryType } from '../models/EntryType';
import { IUserObject } from './users/IUserObject';

export interface IChangeLogEntryObject {
	createdAt: string;
	actor: IUserObject;
	actionType: ChangeLogEvent;
	entryType: EntryType;
}
