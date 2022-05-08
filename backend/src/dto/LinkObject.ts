import { ArtistLink } from '../entities/ArtistLink';
import { Link } from '../entities/Link';
import { WorkLink } from '../entities/WorkLink';
import { PermissionContext } from '../services/PermissionContext';
import { ArtistObject } from './ArtistObject';
import { LinkTypeObject } from './LinkTypeObject';
import { PartialDateObject } from './PartialDateObject';
import { WorkObject } from './WorkObject';

abstract class LinkObject {
	readonly linkType: LinkTypeObject;
	readonly beginDate: PartialDateObject;
	readonly endDate: PartialDateObject;
	readonly ended: boolean;

	protected constructor(link: Link) {
		this.linkType = new LinkTypeObject(link.linkType);
		this.beginDate = new PartialDateObject(link.beginDate);
		this.endDate = new PartialDateObject(link.endDate);
		this.ended = link.ended;
	}
}

export class ArtistLinkObject extends LinkObject {
	readonly id: number;
	readonly relatedArtist: ArtistObject;

	constructor(artistLink: ArtistLink, permissionContext: PermissionContext) {
		super(artistLink);

		this.id = artistLink.id;
		this.relatedArtist = new ArtistObject(
			artistLink.relatedArtist,
			permissionContext,
		);
	}
}

export class WorkLinkObject extends LinkObject {
	readonly id: number;
	readonly relatedWork: WorkObject;

	constructor(workLink: WorkLink, permissionContext: PermissionContext) {
		super(workLink);

		this.id = workLink.id;
		this.relatedWork = new WorkObject(
			workLink.relatedWork,
			permissionContext,
		);
	}
}
