import { Artist } from '../../entities/Artist';
import { ArtistLink } from '../../entities/ArtistLink';
import { Link } from '../../entities/Link';
import { LinkType } from '../../entities/LinkType';
import { Work } from '../../entities/Work';
import { WorkLink } from '../../entities/WorkLink';
import { ObjectRefSnapshot } from './ObjectRefSnapshot';
import { PartialDateSnapshot } from './PartialDateSnapshot';

abstract class LinkSnapshot {
	readonly linkType: ObjectRefSnapshot<LinkType>;
	readonly beginDate: PartialDateSnapshot;
	readonly endDate: PartialDateSnapshot;
	readonly ended: boolean;

	constructor(link: Link) {
		this.linkType = new ObjectRefSnapshot<LinkType>(link.linkType);
		this.beginDate = new PartialDateSnapshot(link.beginDate);
		this.endDate = new PartialDateSnapshot(link.endDate);
		this.ended = link.ended;
	}
}

export class ArtistLinkSnapshot extends LinkSnapshot {
	readonly relatedArtist: ObjectRefSnapshot<Artist>;

	constructor(artistLink: ArtistLink) {
		super(artistLink);

		this.relatedArtist = new ObjectRefSnapshot<Artist>(
			artistLink.relatedArtist,
		);
	}
}

export class WorkLinkSnapshot extends LinkSnapshot {
	readonly relatedWork: ObjectRefSnapshot<Work>;

	constructor(workLink: WorkLink) {
		super(workLink);

		this.relatedWork = new ObjectRefSnapshot<Work>(workLink.relatedWork);
	}
}
