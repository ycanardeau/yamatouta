import { Permission } from './Permission';
import { UserGroup } from './UserGroup';

const limitedUserPermissions: Permission[] = [];

const userPermissions: Permission[] = [...limitedUserPermissions];

const advancedUserPermissions: Permission[] = [...userPermissions];

const modPermissions: Permission[] = [...advancedUserPermissions];

const seniorModPermissions: Permission[] = [...modPermissions];

const adminPermissions: Permission[] = [
	...seniorModPermissions,
	Permission.ViewDeletedEntries,
	Permission.ViewHiddenEntries,
];

export const userGroupPermissions: Record<UserGroup, Permission[]> = {
	[UserGroup.LimitedUser]: limitedUserPermissions,
	[UserGroup.User]: userPermissions,
	[UserGroup.AdvancedUser]: advancedUserPermissions,
	[UserGroup.Mod]: modPermissions,
	[UserGroup.SeniorMod]: seniorModPermissions,
	[UserGroup.Admin]: adminPermissions,
};
