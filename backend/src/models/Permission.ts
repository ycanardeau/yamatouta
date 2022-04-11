import { UserGroup } from './UserGroup';

export enum Permission {
	CreateArtists = 'CreateArtists',
	CreateMissingRevisions = 'CreateMissingRevisions',
	CreateQuotes = 'CreateQuotes',
	CreateTranslations = 'CreateTranslations',
	CreateWorks = 'CreateWorks',
	DeleteArtists = 'DeleteArtists',
	DeleteQuotes = 'DeleteQuotes',
	DeleteTranslations = 'DeleteTranslations',
	DeleteWorks = 'DeleteWorks',
	EditArtists = 'EditArtists',
	EditQuotes = 'EditQuotes',
	EditTranslations = 'EditTranslations',
	EditWorks = 'EditWorks',
	ViewDeletedEntries = 'ViewDeletedEntries',
	ViewEditHistory = 'ViewEditHistory',
	ViewHiddenEntries = 'ViewHiddenEntries',
}

const limitedUserPermissions: Permission[] = [];

const userPermissions: Permission[] = [...limitedUserPermissions];

const advancedUserPermissions: Permission[] = [
	...userPermissions,
	Permission.CreateTranslations,
];

const modPermissions: Permission[] = [...advancedUserPermissions];

const seniorModPermissions: Permission[] = [...modPermissions];

const adminPermissions: Permission[] = [
	...seniorModPermissions,
	Permission.CreateArtists,
	Permission.CreateMissingRevisions,
	Permission.CreateQuotes,
	Permission.CreateWorks,
	Permission.DeleteArtists,
	Permission.DeleteQuotes,
	Permission.DeleteTranslations,
	Permission.DeleteWorks,
	Permission.EditArtists,
	Permission.EditQuotes,
	Permission.EditTranslations,
	Permission.EditWorks,
	Permission.ViewDeletedEntries,
	Permission.ViewHiddenEntries,
	Permission.ViewEditHistory,
];

export const userGroupPermissions: Record<UserGroup, Permission[]> = {
	[UserGroup.LimitedUser]: limitedUserPermissions,
	[UserGroup.User]: userPermissions,
	[UserGroup.AdvancedUser]: advancedUserPermissions,
	[UserGroup.Mod]: modPermissions,
	[UserGroup.SeniorMod]: seniorModPermissions,
	[UserGroup.Admin]: adminPermissions,
};
