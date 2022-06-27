import { Hashtag } from '../entities/Hashtag';
import { PermissionContext } from '../services/PermissionContext';

export class HashtagObject {
	private constructor(readonly name: string) {}

	static create(
		hashtag: Hashtag,
		permissionContext: PermissionContext,
	): HashtagObject {
		permissionContext.verifyDeletedAndHidden(hashtag);

		return new HashtagObject(hashtag.name);
	}
}
