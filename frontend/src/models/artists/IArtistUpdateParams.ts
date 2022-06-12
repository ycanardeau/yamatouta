import { IHashtagLinkUpdateParams } from '../IHashtagLinkUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { ArtistType } from './ArtistType';

export interface IArtistUpdateParams {
	id: number;
	name: string;
	artistType: ArtistType;
	hashtagLinks: IHashtagLinkUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
}
