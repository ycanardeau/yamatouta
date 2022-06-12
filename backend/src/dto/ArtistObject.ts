import { Artist } from '../entities/Artist';
import { EntryType } from '../models/EntryType';
import { ArtistOptionalField } from '../models/artists/ArtistOptionalField';
import { ArtistType } from '../models/artists/ArtistType';
import { PermissionContext } from '../services/PermissionContext';
import { HashtagLinkObject } from './HashtagLinkObject';
import { WebLinkObject } from './WebLinkObject';

export class ArtistObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Artist,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly avatarUrl?: string,
		readonly hashtagLinks?: HashtagLinkObject[],
		readonly webLinks?: WebLinkObject[],
	) {}

	static create(
		artist: Artist,
		permissionContext: PermissionContext,
		fields: ArtistOptionalField[] = [],
	): ArtistObject {
		permissionContext.verifyDeletedAndHidden(artist);

		const hashtagLinks = fields.includes(ArtistOptionalField.HashtagLinks)
			? artist.hashtagLinks
					.getItems()
					.map((hashtagLink) =>
						HashtagLinkObject.create(
							hashtagLink,
							permissionContext,
						),
					)
			: undefined;

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
			hashtagLinks,
			webLinks,
		);
	}
}
