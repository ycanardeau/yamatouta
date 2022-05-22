import { Artist } from '../../entities/Artist';
import { ArtistType } from '../ArtistType';
import { IContentEquatable } from '../IContentEquatable';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IArtistSnapshot = Omit<ArtistSnapshot, 'contentEquals'>;

export class ArtistSnapshot implements IContentEquatable<IArtistSnapshot> {
	readonly name: string;
	readonly artistType: ArtistType;
	readonly webLinks: WebLinkSnapshot[];

	constructor(artist: Artist) {
		this.name = artist.name;
		this.artistType = artist.artistType;
		this.webLinks = artist.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other?: IArtistSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
