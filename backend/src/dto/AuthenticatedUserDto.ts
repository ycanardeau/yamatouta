import { User } from '@/entities/User';
import { EntryType } from '@/models/EntryType';
import { Permission } from '@/models/Permission';
import { UserGroup } from '@/models/users/UserGroup';
import { NotFoundException } from '@nestjs/common';

export class AuthenticatedUserDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.User,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly avatarUrl: string,
		readonly effectivePermissions: Permission[],
		readonly userGroup: UserGroup,
	) {}

	static create(user: User): AuthenticatedUserDto {
		if (user.deleted || user.hidden) throw new NotFoundException();

		return new AuthenticatedUserDto(
			user.id,
			user.entryType,
			user.deleted,
			user.hidden,
			user.name,
			'' /* TODO */,
			user.effectivePermissions,
			user.userGroup,
		);
	}
}
