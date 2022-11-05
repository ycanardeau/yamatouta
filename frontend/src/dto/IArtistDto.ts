import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { IEntryWithIdAndName } from '@/models/IEntryWithIdAndName';
import { ArtistType } from '@/models/artists/ArtistType';

export interface IArtistDto
	extends IEntryWithIdAndName,
		IEntryWithEntryType<EntryType.Artist> {
	artistType: ArtistType;
	avatarUrl?: string;
	webLinks?: IWebLinkDto[];
}
