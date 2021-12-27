import { PermissionContext } from './PermissionContext';

export const whereNotDeleted = (
	permissionContext: PermissionContext,
): { deleted: boolean } | Record<string, never> => {
	if (permissionContext.canViewDeletedEntries) return {};

	return { deleted: false };
};

export const whereNotHidden = (
	permissionContext: PermissionContext,
): { hidden: boolean } | Record<string, never> => {
	if (permissionContext.canViewHiddenEntries) return {};

	return { hidden: false };
};
