import { Hashtag } from '../entities/Hashtag';
import { PermissionContext } from '../services/PermissionContext';

export class HashtagObject {
	private constructor(
		readonly name: string,
		readonly referenceCount: number,
	) {}

	static create(
		permissionContext: PermissionContext,
		hashtag: Hashtag,
	): HashtagObject {
		permissionContext.verifyDeletedAndHidden(hashtag);

		return new HashtagObject(hashtag.name, hashtag.referenceCount);
	}
}
