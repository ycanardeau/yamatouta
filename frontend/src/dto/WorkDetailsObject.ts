import { WorkType } from '../models/works/WorkType';
import { IWebLinkObject } from './IWebLinkObject';
import { IWorkObject } from './IWorkObject';

export class WorkDetailsObject {
	private constructor(
		readonly id: number,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks: IWebLinkObject[],
	) {}

	static create(work: Required<IWorkObject>): WorkDetailsObject {
		return new WorkDetailsObject(
			work.id,
			work.name,
			work.workType,
			work.webLinks,
		);
	}
}
