import { IArtistLinkUpdateParams } from '../IArtistLinkUpdateParams';
import { IHashtagUpdateParams } from '../IHashtagUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { WorkType } from './WorkType';

export interface IWorkUpdateParams {
	id: number;
	name: string;
	workType: WorkType;
	hashtags: IHashtagUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	artistLinks: IArtistLinkUpdateParams[];
}
