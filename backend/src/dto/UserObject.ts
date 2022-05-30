import { User } from '../entities/User';
import { PermissionContext } from '../services/PermissionContext';
import { generateGravatarUrl } from '../utils/generateGravatarUrl';

export class UserObject {
	private constructor(
		readonly id: number,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(
		user: User,
		permissionContext: PermissionContext,
	): UserObject {
		permissionContext.verifyDeletedAndHidden(user);

		return new UserObject(
			user.id,
			user.deleted,
			user.hidden,
			user.name,
			generateGravatarUrl(user.email),
		);
	}
}
