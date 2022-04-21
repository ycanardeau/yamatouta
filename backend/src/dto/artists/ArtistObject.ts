import { Artist } from '../../entities/Artist';
import { ArtistOptionalFields } from '../../models/ArtistOptionalFields';
import { ArtistType } from '../../models/ArtistType';
import { PermissionContext } from '../../services/PermissionContext';
import { WebLinkObject } from '../WebLinkObject';

export class ArtistObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly artistType: ArtistType;
	readonly avatarUrl?: string;
	readonly webLinks?: WebLinkObject[];

	constructor(
		artist: Artist,
		permissionContext: PermissionContext,
		fields: ArtistOptionalFields[] = [],
	) {
		permissionContext.verifyDeletedAndHidden(artist);

		this.id = artist.id;
		this.deleted = artist.deleted;
		this.hidden = artist.hidden;
		this.name = artist.name;
		this.artistType = artist.artistType;
		this.avatarUrl = undefined /* TODO: Implement. */;
		this.webLinks = fields.includes(ArtistOptionalFields.WebLinks)
			? artist.webLinks
					.getItems()
					.map((webLink) => new WebLinkObject(webLink))
			: undefined;
	}
}
