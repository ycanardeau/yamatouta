import { UserGroup } from './UserGroup';

export enum Permission {
	Admin_CreateMissingRevisions = 'Admin_CreateMissingRevisions',
	Admin_UpdateSearchIndex = 'Admin_UpdateSearchIndex',
	Admin_ViewDeletedEntries = 'Admin_ViewDeletedEntries',
	Admin_ViewHiddenEntries = 'Admin_ViewHiddenEntries',
	Artist_Create = 'Artist_Create',
	Artist_Delete = 'Artist_Delete',
	Artist_Update = 'Artist_Update',
	ArtistLink_Create = 'ArtistLink_Create',
	ArtistLink_Delete = 'ArtistLink_Delete',
	ArtistLink_Update = 'ArtistLink_Update',
	Quote_Create = 'Quote_Create',
	Quote_Delete = 'Quote_Delete',
	Quote_Update = 'Quote_Update',
	Revision_View = 'Revision_View',
	Translation_Create = 'Translation_Create',
	Translation_Delete = 'Translation_Delete',
	Translation_Update = 'Translation_Update',
	WebLink_Create = 'WebLink_Create',
	WebLink_Delete = 'WebLink_Delete',
	WebLink_Update = 'WebLink_Update',
	Work_Create = 'Work_Create',
	Work_Delete = 'Work_Delete',
	Work_Update = 'Work_Update',
	WorkLink_Create = 'WorkLink_Create',
	WorkLink_Delete = 'WorkLink_Delete',
	WorkLink_Update = 'WorkLink_Update',
}

const limitedUserPermissions: Permission[] = [];

const userPermissions: Permission[] = [...limitedUserPermissions];

const advancedUserPermissions: Permission[] = [
	...userPermissions,
	Permission.Translation_Create,
];

const modPermissions: Permission[] = [...advancedUserPermissions];

const seniorModPermissions: Permission[] = [...modPermissions];

const adminPermissions: Permission[] = [
	...seniorModPermissions,
	Permission.Admin_CreateMissingRevisions,
	Permission.Admin_UpdateSearchIndex,
	Permission.Admin_ViewDeletedEntries,
	Permission.Admin_ViewHiddenEntries,
	Permission.Artist_Create,
	Permission.Artist_Delete,
	Permission.Artist_Update,
	Permission.ArtistLink_Create,
	Permission.ArtistLink_Delete,
	Permission.ArtistLink_Update,
	Permission.Quote_Create,
	Permission.Quote_Delete,
	Permission.Quote_Update,
	Permission.Revision_View,
	Permission.Translation_Delete,
	Permission.Translation_Update,
	Permission.WebLink_Create,
	Permission.WebLink_Delete,
	Permission.WebLink_Update,
	Permission.Work_Create,
	Permission.Work_Update,
	Permission.Work_Delete,
	Permission.WorkLink_Create,
	Permission.WorkLink_Delete,
	Permission.WorkLink_Update,
];

export const userGroupPermissions: Record<UserGroup, Permission[]> = {
	[UserGroup.LimitedUser]: limitedUserPermissions,
	[UserGroup.User]: userPermissions,
	[UserGroup.AdvancedUser]: advancedUserPermissions,
	[UserGroup.Mod]: modPermissions,
	[UserGroup.SeniorMod]: seniorModPermissions,
	[UserGroup.Admin]: adminPermissions,
};
