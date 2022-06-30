import { HashtagLink } from '../entities/HashtagLink';
import { PermissionContext } from '../services/PermissionContext';

export class HashtagLinkObject {
	private constructor(readonly id: number, readonly name: string) {}

	static create(
		hashtagLink: HashtagLink,
		permissionContext: PermissionContext,
	): HashtagLinkObject {
		// REVIEW
		permissionContext.verifyDeletedAndHidden(
			hashtagLink.relatedHashtag.getEntity(),
		);

		return new HashtagLinkObject(hashtagLink.id, hashtagLink.name);
	}
}
