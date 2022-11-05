import { IArtistDto } from '@/dto/IArtistDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { ArtistType } from '@/models/artists/ArtistType';

export class ArtistDetailsDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Artist,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: IWebLinkDto[],
	) {}

	static create(artist: Required<IArtistDto>): ArtistDetailsDto {
		return new ArtistDetailsDto(
			artist.id,
			artist.entryType,
			artist.name,
			artist.artistType,
			artist.webLinks,
		);
	}
}
