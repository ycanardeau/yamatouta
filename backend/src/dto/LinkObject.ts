import { ArtistObject } from '@/dto/ArtistObject';
import { PartialDateObject } from '@/dto/PartialDateObject';
import { WorkObject } from '@/dto/WorkObject';
import { ArtistLink } from '@/entities/ArtistLink';
import { Link } from '@/entities/Link';
import { WorkLink } from '@/entities/WorkLink';
import { LinkType } from '@/models/LinkType';
import { PermissionContext } from '@/services/PermissionContext';

abstract class LinkObject {
	readonly linkType: LinkType;
	readonly beginDate: PartialDateObject;
	readonly endDate: PartialDateObject;
	readonly ended: boolean;

	protected constructor(link: Link) {
		this.linkType = link.linkType;
		this.beginDate = PartialDateObject.create(link.beginDate);
		this.endDate = PartialDateObject.create(link.endDate);
		this.ended = link.ended;
	}
}

export class ArtistLinkObject extends LinkObject {
	private constructor(
		artistLink: ArtistLink,
		readonly id: number,
		readonly relatedArtist: ArtistObject,
	) {
		super(artistLink);
	}

	static create(
		permissionContext: PermissionContext,
		artistLink: ArtistLink,
	): ArtistLinkObject {
		const relatedArtist = ArtistObject.create(
			permissionContext,
			artistLink.relatedArtist.getEntity(),
		);

		return new ArtistLinkObject(artistLink, artistLink.id, relatedArtist);
	}
}

export class WorkLinkObject extends LinkObject {
	private constructor(
		workLink: WorkLink,
		readonly id: number,
		readonly relatedWork: WorkObject,
	) {
		super(workLink);
	}

	static create(
		workLink: WorkLink,
		permissionContext: PermissionContext,
	): WorkLinkObject {
		const relatedWork = WorkObject.create(
			permissionContext,
			workLink.relatedWork.getEntity(),
		);

		return new WorkLinkObject(workLink, workLink.id, relatedWork);
	}
}
