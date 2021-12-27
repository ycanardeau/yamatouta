import { Artist } from '../../entities/Artist';
import { ArtistType } from '../../models/ArtistType';

export class ArtistObject {
	readonly id: number;
	readonly name: string;
	readonly artistType: ArtistType;
	readonly avatarUrl?: string;

	constructor(artist: Artist) {
		if (artist.deleted || artist.hidden)
			throw new Error(`Artist ${artist.id} has already been deleted.`);

		this.id = artist.id;
		this.name = artist.name;
		this.artistType = artist.artistType;
		this.avatarUrl = undefined /* TODO: Implement. */;
	}
}
