import { Hashtag } from '@/entities/Hashtag';
import { PermissionContext } from '@/services/PermissionContext';

export class HashtagDto {
	private constructor(
		readonly name: string,
		readonly referenceCount: number,
	) {}

	static create(
		permissionContext: PermissionContext,
		hashtag: Hashtag,
	): HashtagDto {
		permissionContext.verifyDeletedAndHidden(hashtag);

		return new HashtagDto(hashtag.name, hashtag.referenceCount);
	}
}
