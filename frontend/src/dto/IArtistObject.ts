import { ArtistType } from '../models/ArtistType';
import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { IWebLinkObject } from './IWebLinkObject';

export interface IArtistObject extends IEntryWithIdAndName {
	artistType: ArtistType;
	avatarUrl?: string;
	webLinks: IWebLinkObject[];
}
