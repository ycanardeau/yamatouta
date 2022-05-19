import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { WorkType } from '../models/works/WorkType';
import { IArtistLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IWorkObject extends IEntryWithIdAndName {
	workType: WorkType;
	webLinks: IWebLinkObject[];
	artistLinks: IArtistLinkObject[];
}
