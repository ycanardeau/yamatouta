import { Artist } from '../../entities/Artist';
import { IContentEquatable } from '../IContentEquatable';
import { ArtistType } from '../artists/ArtistType';
import { HashtagLinkSnapshot } from './HashtagLinkSnapshot';
import { ISnapshotWithHashtagLinks } from './ISnapshotWithHashtagLinks';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IArtistSnapshot = Omit<ArtistSnapshot, 'contentEquals'>;

export class ArtistSnapshot
	implements
		IContentEquatable<IArtistSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithHashtagLinks
{
	constructor(
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkSnapshot[],
		readonly hashtagLinks: HashtagLinkSnapshot[],
	) {}

	static create(artist: Artist): ArtistSnapshot {
		const webLinks = artist.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const hashtagLinks = artist.hashtagLinks
			.getItems()
			.map((hashtagLink) => HashtagLinkSnapshot.create(hashtagLink));

		return new ArtistSnapshot(
			artist.name,
			artist.artistType,
			webLinks,
			hashtagLinks,
		);
	}

	contentEquals(other?: IArtistSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
