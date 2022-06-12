import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { WorkType } from '../models/works/WorkType';
import { IHashtagLinkObject } from './IHashtagLinkObject';
import { IArtistLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IWorkObject
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Work> {
	workType: WorkType;
	hashtagLinks?: IHashtagLinkObject[];
	webLinks?: IWebLinkObject[];
	artistLinks?: IArtistLinkObject[];
}
