import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { Permission } from '@/models/Permission';

export class PermissionContext {
	constructor(private readonly user?: IAuthenticatedUserDto) {}

	hasPermission(permission: Permission): boolean {
		if (!this.user) return false;

		return this.user.effectivePermissions.includes(permission);
	}
}
