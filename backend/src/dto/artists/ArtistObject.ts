import { NotFoundException } from '@nestjs/common';

import { Artist } from '../../entities/Artist';
import { ArtistType } from '../../models/ArtistType';
import { PermissionContext } from '../../services/PermissionContext';

export class ArtistObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly artistType: ArtistType;
	readonly avatarUrl?: string;

	constructor(artist: Artist, permissionContext: PermissionContext) {
		if (artist.deleted && !permissionContext.canViewDeletedEntries)
			throw new NotFoundException();

		if (artist.hidden && !permissionContext.canViewHiddenEntries)
			throw new NotFoundException();

		this.id = artist.id;
		this.deleted = artist.deleted;
		this.hidden = artist.hidden;
		this.name = artist.name;
		this.artistType = artist.artistType;
		this.avatarUrl = undefined /* TODO: Implement. */;
	}
}
