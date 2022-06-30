import { Work } from '../../entities/Work';
import { IContentEquatable } from '../IContentEquatable';
import { WorkType } from '../works/WorkType';
import { ISnapshotWithArtistLinks } from './ISnapshotWithArtistLinks';
import { ISnapshotWithWebLinks } from './ISnapshotWithWebLinks';
import { ArtistLinkSnapshot } from './LinkSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

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
