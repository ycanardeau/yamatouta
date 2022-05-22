import { Work } from '../../entities/Work';
import { IContentEquatable } from '../IContentEquatable';
import { WorkType } from '../WorkType';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IWorkSnapshot = Omit<WorkSnapshot, 'contentEquals'>;

export class WorkSnapshot implements IContentEquatable<IWorkSnapshot> {
	readonly name: string;
	readonly workType: WorkType;
	readonly webLinks: WebLinkSnapshot[];

	constructor(work: Work) {
		this.name = work.name;
		this.workType = work.workType;
		this.webLinks = work.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other?: IWorkSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
