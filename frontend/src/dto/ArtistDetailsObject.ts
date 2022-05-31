import { ArtistType } from '../models/artists/ArtistType';
import { IArtistObject } from './IArtistObject';
import { IWebLinkObject } from './IWebLinkObject';

export class ArtistDetailsObject {
	private constructor(
		readonly id: number,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: IWebLinkObject[],
	) {}

	static create(artist: Required<IArtistObject>): ArtistDetailsObject {
		return new ArtistDetailsObject(
			artist.id,
			artist.name,
			artist.artistType,
			artist.webLinks,
		);
	}
}
