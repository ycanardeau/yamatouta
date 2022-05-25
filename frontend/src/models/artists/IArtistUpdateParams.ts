import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { ArtistType } from './ArtistType';

export interface IArtistUpdateParams {
	id: number;
	name: string;
	artistType: ArtistType;
	webLinks: IWebLinkUpdateParams[];
}
