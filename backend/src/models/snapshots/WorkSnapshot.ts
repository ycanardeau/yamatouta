import { Work } from '../../entities/Work';
import { IContentEquatable } from '../IContentEquatable';
import { WorkType } from '../works/WorkType';
import { HashtagSnapshot } from './HashtagSnapshot';
import { ISnapshotWithArtistLinks } from './ISnapshotWithArtistLinks';
import { ISnapshotWithHashtags } from './ISnapshotWithHashtags';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { ArtistLinkSnapshot } from './LinkSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IWorkSnapshot = Omit<WorkSnapshot, 'contentEquals'>;

export class WorkSnapshot
	implements
		IContentEquatable<IWorkSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithArtistLinks,
		ISnapshotWithHashtags
{
	private constructor(
		readonly name: string,
		readonly sortName: string,
		readonly workType: WorkType,
		readonly webLinks: WebLinkSnapshot[],
		readonly artistLinks: ArtistLinkSnapshot[],
		readonly hashtags: HashtagSnapshot[],
	) {}

	static create(work: Work): WorkSnapshot {
		const webLinks = work.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const artistLinks = work.artistLinks
			.getItems()
			.map((artistLink) => ArtistLinkSnapshot.create(artistLink));

		const hashtags = work.hashtagLinks
			.getItems()
			.map((hashtagLink) =>
				HashtagSnapshot.create(hashtagLink.relatedHashtag.getEntity()),
			);

		return new WorkSnapshot(
			work.name,
			work.sortName,
			work.workType,
			webLinks,
			artistLinks,
			hashtags,
		);
	}

	contentEquals(other?: IWorkSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
