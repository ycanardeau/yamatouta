import { UserGroup } from './UserGroup';

export enum Permission {
	ViewDeletedEntries = 'ViewDeletedEntries',
	ViewHiddenEntries = 'ViewHiddenEntries',
	CreateTranslations = 'CreateTranslations',
	EditTranslations = 'EditTranslations',
	ViewEditHistory = 'ViewEditHistory',
	DeleteTranslations = 'DeleteTranslations',
}

const limitedUserPermissions: Permission[] = [];

const userPermissions: Permission[] = [...limitedUserPermissions];

const advancedUserPermissions: Permission[] = [...userPermissions];

const modPermissions: Permission[] = [...advancedUserPermissions];

const seniorModPermissions: Permission[] = [...modPermissions];

const adminPermissions: Permission[] = [
	...seniorModPermissions,
	Permission.ViewDeletedEntries,
	Permission.ViewHiddenEntries,
	Permission.CreateTranslations,
	Permission.EditTranslations,
	Permission.ViewEditHistory,
	Permission.DeleteTranslations,
];

export const userGroupPermissions: Record<UserGroup, Permission[]> = {
	[UserGroup.LimitedUser]: limitedUserPermissions,
	[UserGroup.User]: userPermissions,
	[UserGroup.AdvancedUser]: advancedUserPermissions,
	[UserGroup.Mod]: modPermissions,
	[UserGroup.SeniorMod]: seniorModPermissions,
	[UserGroup.Admin]: adminPermissions,
};
