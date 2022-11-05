import { IArtistLinkObject } from '@/dto/ILinkObject';
import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '@/models/IEntryWithIdAndName';
import { WorkType } from '@/models/works/WorkType';

export interface IWorkObject
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Work> {
	workType: WorkType;
	webLinks?: IWebLinkObject[];
	artistLinks?: IArtistLinkObject[];
}
