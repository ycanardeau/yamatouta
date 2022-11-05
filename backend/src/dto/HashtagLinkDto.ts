import { HashtagLink } from '@/entities/HashtagLink';
import { PermissionContext } from '@/services/PermissionContext';

export class HashtagLinkDto {
	_hashtagLinkDtoBrand: any;

	private constructor(readonly id: number, readonly name: string) {}

	static create(
		permissionContext: PermissionContext,
		hashtagLink: HashtagLink,
	): HashtagLinkDto {
		// REVIEW
		permissionContext.verifyDeletedAndHidden(
			hashtagLink.relatedHashtag.getEntity(),
		);

		return new HashtagLinkDto(hashtagLink.id, hashtagLink.name);
	}
}
