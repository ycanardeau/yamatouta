import { Permission } from '../models/Permission';
import { UserGroup } from '../models/users/UserGroup';

export interface IAuthenticatedUserObject {
	id: number;
	name: string;
	avatarUrl: string;
	effectivePermissions: Permission[];
	userGroup: UserGroup;
}
