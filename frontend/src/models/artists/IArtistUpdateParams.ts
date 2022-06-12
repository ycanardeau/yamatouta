import { IHashtagUpdateParams } from '../IHashtagUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { ArtistType } from './ArtistType';

export interface IArtistUpdateParams {
	id: number;
	name: string;
	artistType: ArtistType;
	hashtags: IHashtagUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
}
