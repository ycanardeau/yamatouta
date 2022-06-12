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
	Permission.CreateHashtagLinks,
	Permission.CreateMissingRevisions,
	Permission.CreateQuotes,
	Permission.CreateWebLinks,
	Permission.CreateWorkLinks,
	Permission.CreateWorks,
	Permission.DeleteArtistLinks,
	Permission.DeleteArtists,
	Permission.DeleteHashtagLinks,
	Permission.DeleteQuotes,
	Permission.DeleteTranslations,
	Permission.DeleteWebLinks,
	Permission.DeleteWorkLinks,
	Permission.DeleteWorks,
	Permission.GenerateSitemaps,
	Permission.UpdateArtistLinks,
	Permission.UpdateArtists,
	Permission.UpdateHashtagLinks,
	Permission.UpdateQuotes,
	Permission.UpdateSearchIndex,
	Permission.UpdateTranslations,
	Permission.UpdateWebLinks,
	Permission.UpdateWorkLinks,
	Permission.UpdateWorks,
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
