import { WebLinkDto } from '@/dto/WebLinkDto';
import { Artist } from '@/entities/Artist';
import { EntryType } from '@/models/EntryType';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistType } from '@/models/artists/ArtistType';
import { PermissionContext } from '@/services/PermissionContext';

export class ArtistDto {
	_artistDtoBrand: any;

	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Artist,
		readonly createdAt: Date,
		readonly updatedAt: Date,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly avatarUrl?: string,
		readonly webLinks?: WebLinkDto[],
	) {}

	static create(
		permissionContext: PermissionContext,
		artist: Artist,
		fields: ArtistOptionalField[] = [],
	): ArtistDto {
		permissionContext.verifyDeletedAndHidden(artist);

		const webLinks = fields.includes(ArtistOptionalField.WebLinks)
			? artist.webLinks
					.getItems()
					.map((webLink) => WebLinkDto.create(webLink))
			: undefined;

		return new ArtistDto(
			artist.id,
			artist.entryType,
			artist.createdAt,
			artist.updatedAt,
			artist.deleted,
			artist.hidden,
			artist.name,
			artist.artistType,
			undefined /* TODO: Implement. */,
			webLinks,
		);
	}
}
