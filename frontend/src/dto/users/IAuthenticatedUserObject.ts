import { Permission } from '../../models/Permission';

export interface IAuthenticatedUserObject {
	id: number;
	name: string;
	avatarUrl?: string;
	effectivePermissions: Permission[];
}
