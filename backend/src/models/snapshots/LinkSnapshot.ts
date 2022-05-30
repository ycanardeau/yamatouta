import { Artist } from '../../entities/Artist';
import { ArtistLink } from '../../entities/ArtistLink';
import { Link } from '../../entities/Link';
import { Work } from '../../entities/Work';
import { WorkLink } from '../../entities/WorkLink';
import { LinkType } from '../LinkType';
import { ObjectRefSnapshot } from './ObjectRefSnapshot';
import { PartialDateSnapshot } from './PartialDateSnapshot';

abstract class LinkSnapshot {
	readonly linkType: LinkType;
	readonly beginDate: PartialDateSnapshot;
	readonly endDate: PartialDateSnapshot;
	readonly ended: boolean;

	protected constructor(link: Link) {
		this.linkType = link.linkType;
		this.beginDate = PartialDateSnapshot.create(link.beginDate);
		this.endDate = PartialDateSnapshot.create(link.endDate);
		this.ended = link.ended;
	}
}

export class ArtistLinkSnapshot extends LinkSnapshot {
	private constructor(
		artistLink: ArtistLink,
		readonly relatedArtist: ObjectRefSnapshot<Artist>,
	) {
		super(artistLink);
	}

	static create(artistLink: ArtistLink): ArtistLinkSnapshot {
		const relatedArtist = ObjectRefSnapshot.create<Artist>(
			artistLink.relatedArtist,
		);

		return new ArtistLinkSnapshot(artistLink, relatedArtist);
	}
}

export class WorkLinkSnapshot extends LinkSnapshot {
	private constructor(
		workLink: WorkLink,
		readonly relatedWork: ObjectRefSnapshot<Work>,
	) {
		super(workLink);
	}

	static create(workLink: WorkLink): WorkLinkSnapshot {
		const relatedWork = ObjectRefSnapshot.create<Work>(
			workLink.relatedWork,
		);

		return new WorkLinkSnapshot(workLink, relatedWork);
	}
}
