import { IArtistObject } from './IArtistObject';
import { ILinkObject } from './ILinkObject';

export interface IArtistLinkObject {
	artist: IArtistObject;
	link: ILinkObject;
}
