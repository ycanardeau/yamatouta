import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class GetAuthenticatedUserService {
	constructor(private readonly permissionContext: PermissionContext) {}

	getAuthenticatedUser(): AuthenticatedUserObject {
		if (!this.permissionContext.user) throw new UnauthorizedException();

		return this.permissionContext.user;
	}
}
