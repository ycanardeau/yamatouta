import { IArtistObject } from '@/dto/IArtistObject';
import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { ArtistType } from '@/models/artists/ArtistType';

export class ArtistDetailsObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Artist,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: IWebLinkObject[],
	) {}

	static create(artist: Required<IArtistObject>): ArtistDetailsObject {
		return new ArtistDetailsObject(
			artist.id,
			artist.entryType,
			artist.name,
			artist.artistType,
			artist.webLinks,
		);
	}
}
