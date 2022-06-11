import { EntryType } from '../models/EntryType';
import { LinkType } from '../models/LinkType';
import { WorkType } from '../models/works/WorkType';
import { IArtistLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';
import { IWorkObject } from './IWorkObject';

export class WorkDetailsObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Work,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks: IWebLinkObject[],
		readonly authors: IArtistLinkObject[],
		readonly editors: IArtistLinkObject[],
		readonly publishers: IArtistLinkObject[],
		readonly translators: IArtistLinkObject[],
	) {}

	static create(work: Required<IWorkObject>): WorkDetailsObject {
		return new WorkDetailsObject(
			work.id,
			work.entryType,
			work.name,
			work.workType,
			work.webLinks,
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Author,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Editor,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Publisher,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Translator,
			),
		);
	}
}
