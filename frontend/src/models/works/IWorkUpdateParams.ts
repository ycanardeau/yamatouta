import { IArtistLinkUpdateParams } from '../IArtistLinkUpdateParams';
import { IHashtagLinkUpdateParams } from '../IHashtagLinkUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { WorkType } from './WorkType';

export interface IWorkUpdateParams {
	id: number;
	name: string;
	workType: WorkType;
	hashtagLinks: IHashtagLinkUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	artistLinks: IArtistLinkUpdateParams[];
}
