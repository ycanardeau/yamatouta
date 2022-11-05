import { ArtistDto } from '@/dto/ArtistDto';
import { PartialDateDto } from '@/dto/PartialDateDto';
import { WorkDto } from '@/dto/WorkDto';
import { ArtistLink } from '@/entities/ArtistLink';
import { Link } from '@/entities/Link';
import { WorkLink } from '@/entities/WorkLink';
import { LinkType } from '@/models/LinkType';
import { PermissionContext } from '@/services/PermissionContext';

abstract class LinkDto {
	readonly linkType: LinkType;
	readonly beginDate: PartialDateDto;
	readonly endDate: PartialDateDto;
	readonly ended: boolean;

	protected constructor(link: Link) {
		this.linkType = link.linkType;
		this.beginDate = PartialDateDto.create(link.beginDate);
		this.endDate = PartialDateDto.create(link.endDate);
		this.ended = link.ended;
	}
}

export class ArtistLinkDto extends LinkDto {
	_artistLinkDtoBrand: any;

	private constructor(
		artistLink: ArtistLink,
		readonly id: number,
		readonly relatedArtist: ArtistDto,
	) {
		super(artistLink);
	}

	static create(
		permissionContext: PermissionContext,
		artistLink: ArtistLink,
	): ArtistLinkDto {
		const relatedArtist = ArtistDto.create(
			permissionContext,
			artistLink.relatedArtist.getEntity(),
		);

		return new ArtistLinkDto(artistLink, artistLink.id, relatedArtist);
	}
}

export class WorkLinkDto extends LinkDto {
	_workLinkDtoBrand: any;

	private constructor(
		workLink: WorkLink,
		readonly id: number,
		readonly relatedWork: WorkDto,
	) {
		super(workLink);
	}

	static create(
		workLink: WorkLink,
		permissionContext: PermissionContext,
	): WorkLinkDto {
		const relatedWork = WorkDto.create(
			permissionContext,
			workLink.relatedWork.getEntity(),
		);

		return new WorkLinkDto(workLink, workLink.id, relatedWork);
	}
}
