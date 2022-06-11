import { Artist } from '../../entities/Artist';
import { IContentEquatable } from '../IContentEquatable';
import { ArtistType } from '../artists/ArtistType';
import { HashtagSnapshot } from './HashtagSnapshot';
import { ISnapshotWithHashtags } from './ISnapshotWithHashtags';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IArtistSnapshot = Omit<ArtistSnapshot, 'contentEquals'>;

export class ArtistSnapshot
	implements
		IContentEquatable<IArtistSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithHashtags
{
	constructor(
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkSnapshot[],
		readonly hashtags: HashtagSnapshot[],
	) {}

	static create(artist: Artist): ArtistSnapshot {
		const webLinks = artist.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const hashtags = artist.hashtagLinks
			.getItems()
			.map((hashtagLink) =>
				HashtagSnapshot.create(hashtagLink.relatedHashtag.getEntity()),
			);

		return new ArtistSnapshot(
			artist.name,
			artist.artistType,
			webLinks,
			hashtags,
		);
	}

	contentEquals(other?: IArtistSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
