import { User } from '@/entities/User';
import { EntryType } from '@/models/EntryType';
import { PermissionContext } from '@/services/PermissionContext';

export class UserDto {
	_userDtoBrand: any;

	private constructor(
		readonly id: number,
		readonly entryType: EntryType.User,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly avatarUrl: string,
	) {}

	static create(permissionContext: PermissionContext, user: User): UserDto {
		permissionContext.verifyDeletedAndHidden(user);

		return new UserDto(
			user.id,
			user.entryType,
			user.deleted,
			user.hidden,
			user.name,
			'' /* TODO */,
		);
	}
}
