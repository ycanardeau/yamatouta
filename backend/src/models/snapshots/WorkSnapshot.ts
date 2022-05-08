import { Work } from '../../entities/Work';
import { IContentEquatable } from '../IContentEquatable';
import { WorkType } from '../works/WorkType';
import { ArtistLinkSnapshot } from './LinkSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IWorkSnapshot = Omit<WorkSnapshot, 'contentEquals'>;

export class WorkSnapshot implements IContentEquatable<IWorkSnapshot> {
	readonly name: string;
	readonly workType: WorkType;
	readonly webLinks: WebLinkSnapshot[];
	readonly artistLinks: ArtistLinkSnapshot[];

	constructor(work: Work) {
		this.name = work.name;
		this.workType = work.workType;
		this.webLinks = work.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
		this.artistLinks = work.artistLinks
			.getItems()
			.map((artistLink) => new ArtistLinkSnapshot(artistLink));
	}

	contentEquals(other?: IWorkSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
