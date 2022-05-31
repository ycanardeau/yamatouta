import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { ArtistType } from '../models/artists/ArtistType';
import { IWebLinkObject } from './IWebLinkObject';

export interface IArtistObject extends IEntryWithIdAndName {
	artistType: ArtistType;
	avatarUrl?: string;
	webLinks?: IWebLinkObject[];
}
