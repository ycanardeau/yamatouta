import { WebLinkObject } from '@/dto/WebLinkObject';
import { Artist } from '@/entities/Artist';
import { EntryType } from '@/models/EntryType';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistType } from '@/models/artists/ArtistType';
import { PermissionContext } from '@/services/PermissionContext';

export class ArtistObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Artist,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly avatarUrl?: string,
		readonly webLinks?: WebLinkObject[],
	) {}

	static create(
		permissionContext: PermissionContext,
		artist: Artist,
		fields: ArtistOptionalField[] = [],
	): ArtistObject {
		permissionContext.verifyDeletedAndHidden(artist);

		const webLinks = fields.includes(ArtistOptionalField.WebLinks)
			? artist.webLinks
					.getItems()
					.map((webLink) => WebLinkObject.create(webLink))
			: undefined;

		return new ArtistObject(
			artist.id,
			artist.entryType,
			artist.deleted,
			artist.hidden,
			artist.name,
			artist.artistType,
			undefined /* TODO: Implement. */,
			webLinks,
		);
	}
}
