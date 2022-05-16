import { IAuthenticatedUserObject } from './dto/IAuthenticatedUserObject';
import { Permission } from './models/Permission';

export class PermissionContext {
	constructor(private readonly user?: IAuthenticatedUserObject) {}

	hasPermission(permission: Permission): boolean {
		if (!this.user) return false;

		return this.user.effectivePermissions.includes(permission);
	}
}
