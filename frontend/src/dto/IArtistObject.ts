import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '@/models/IEntryWithIdAndName';
import { ArtistType } from '@/models/artists/ArtistType';

export interface IArtistObject
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Artist> {
	artistType: ArtistType;
	avatarUrl?: string;
	webLinks?: IWebLinkObject[];
}
