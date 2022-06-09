import { Permission } from './Permission';
import { UserGroup } from './users/UserGroup';

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
	Permission.CreateArtistLinks,
	Permission.CreateArtists,
	Permission.CreateMissingRevisions,
	Permission.CreateQuotes,
	Permission.CreateWebLinks,
	Permission.CreateWorkLinks,
	Permission.CreateWorks,
	Permission.DeleteArtists,
	Permission.DeleteArtistLinks,
	Permission.DeleteQuotes,
	Permission.DeleteTranslations,
	Permission.DeleteWebLinks,
	Permission.DeleteWorks,
	Permission.DeleteWorkLinks,
	Permission.UpdateArtistLinks,
	Permission.UpdateArtists,
	Permission.UpdateQuotes,
	Permission.UpdateSearchIndex,
	Permission.UpdateTranslations,
	Permission.UpdateWebLinks,
	Permission.UpdateWorks,
	Permission.UpdateWorkLinks,
	Permission.ViewDeletedEntries,
	Permission.ViewHiddenEntries,
	Permission.ViewRevisions,
];

export const userGroupPermissions: Record<UserGroup, Permission[]> = {
	[UserGroup.LimitedUser]: limitedUserPermissions,
	[UserGroup.User]: userPermissions,
	[UserGroup.AdvancedUser]: advancedUserPermissions,
	[UserGroup.Mod]: modPermissions,
	[UserGroup.SeniorMod]: seniorModPermissions,
	[UserGroup.Admin]: adminPermissions,
};