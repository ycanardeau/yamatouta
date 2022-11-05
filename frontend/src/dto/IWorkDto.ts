import { IArtistLinkDto } from '@/dto/ILinkDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '@/models/IEntryWithIdAndName';
import { WorkType } from '@/models/works/WorkType';

export interface IWorkDto
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Work> {
	workType: WorkType;
	webLinks?: IWebLinkDto[];
	artistLinks?: IArtistLinkDto[];
}
