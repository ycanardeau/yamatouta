import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '../models/IEntryWithIdAndName';
import { ArtistType } from '../models/artists/ArtistType';
import { IHashtagLinkObject } from './IHashtagLinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IArtistObject
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Artist> {
	artistType: ArtistType;
	avatarUrl?: string;
	hashtagLinks?: IHashtagLinkObject[];
	webLinks?: IWebLinkObject[];
}
