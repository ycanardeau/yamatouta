import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { PermissionContext } from '../../../services/PermissionContext';

@Injectable()
export class GetAuthenticatedUserQueryHandler {
	constructor(private readonly permissionContext: PermissionContext) {}

	execute(): AuthenticatedUserObject {
		if (!this.permissionContext.user) throw new UnauthorizedException();

		return this.permissionContext.user;
	}
}
