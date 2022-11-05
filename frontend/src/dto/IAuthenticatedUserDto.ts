import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { Permission } from '@/models/Permission';
import { UserGroup } from '@/models/users/UserGroup';

export interface IAuthenticatedUserDto
	extends IEntryWithEntryType<EntryType.User> {
	id: number;
	name: string;
	avatarUrl: string;
	effectivePermissions: Permission[];
	userGroup: UserGroup;
}
