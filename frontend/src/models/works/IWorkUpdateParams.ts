import { IArtistLinkUpdateParams } from '../IArtistLinkUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { WorkType } from './WorkType';

export interface IWorkUpdateParams {
	id: number;
	name: string;
	workType: WorkType;
	webLinks: IWebLinkUpdateParams[];
	artistLinks: IArtistLinkUpdateParams[];
}
