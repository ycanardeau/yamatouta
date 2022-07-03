import { User } from '../entities/User';
import { EntryType } from '../models/EntryType';
import { PermissionContext } from '../services/PermissionContext';

export class UserObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.User,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(
		permissionContext: PermissionContext,
		user: User,
	): UserObject {
		permissionContext.verifyDeletedAndHidden(user);

		return new UserObject(
			user.id,
			user.entryType,
			user.deleted,
			user.hidden,
			user.name,
			'' /* TODO */,
		);
	}
}
