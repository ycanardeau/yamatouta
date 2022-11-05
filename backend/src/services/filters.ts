import {
	IEntryWithDeleted,
	IEntryWithHidden,
} from '@/models/IEntryWithDeletedAndHidden';
import { PermissionContext } from '@/services/PermissionContext';

export const whereNotDeleted = (
	permissionContext: PermissionContext,
): IEntryWithDeleted | Record<string, never> => {
	if (permissionContext.canViewDeletedEntries) return {};

	return { deleted: false };
};

export const whereNotHidden = (
	permissionContext: PermissionContext,
): IEntryWithHidden | Record<string, never> => {
	if (permissionContext.canViewHiddenEntries) return {};

	return { hidden: false };
};
