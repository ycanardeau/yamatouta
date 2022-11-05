import { Artist } from '@/entities/Artist';
import { IContentEquatable } from '@/models/IContentEquatable';
import { ArtistType } from '@/models/artists/ArtistType';
import { ISnapshotWithWebLinks } from '@/models/snapshots/ISnapshotWithWebLinks';
import { WebLinkSnapshot } from '@/models/snapshots/WebLinkSnapshot';

export type IArtistSnapshot = Omit<ArtistSnapshot, 'contentEquals'>;

export class ArtistSnapshot
	implements IContentEquatable<IArtistSnapshot>, ISnapshotWithWebLinks
{
	constructor(
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkSnapshot[],
	) {}

	static create(artist: Artist): ArtistSnapshot {
		const webLinks = artist.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		return new ArtistSnapshot(artist.name, artist.artistType, webLinks);
	}

	contentEquals(other?: IArtistSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
