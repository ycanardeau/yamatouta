import { Work } from '@/entities/Work';
import { IContentEquatable } from '@/models/IContentEquatable';
import { ISnapshotWithArtistLinks } from '@/models/snapshots/ISnapshotWithArtistLinks';
import { ISnapshotWithWebLinks } from '@/models/snapshots/ISnapshotWithWebLinks';
import { ArtistLinkSnapshot } from '@/models/snapshots/LinkSnapshot';
import { WebLinkSnapshot } from '@/models/snapshots/WebLinkSnapshot';
import { WorkType } from '@/models/works/WorkType';

export type IWorkSnapshot = Omit<WorkSnapshot, 'contentEquals'>;

export class WorkSnapshot
	implements
		IContentEquatable<IWorkSnapshot>,
		ISnapshotWithWebLinks,
		ISnapshotWithArtistLinks
{
	private constructor(
		readonly name: string,
		readonly sortName: string,
		readonly workType: WorkType,
		readonly webLinks: WebLinkSnapshot[],
		readonly artistLinks: ArtistLinkSnapshot[],
	) {}

	static create(work: Work): WorkSnapshot {
		const webLinks = work.webLinks
			.getItems()
			.map((webLink) => WebLinkSnapshot.create(webLink));

		const artistLinks = work.artistLinks
			.getItems()
			.map((artistLink) => ArtistLinkSnapshot.create(artistLink));

		return new WorkSnapshot(
			work.name,
			work.sortName,
			work.workType,
			webLinks,
			artistLinks,
		);
	}

	contentEquals(other?: IWorkSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
