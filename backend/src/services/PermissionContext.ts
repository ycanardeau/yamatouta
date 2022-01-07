import {
	Inject,
	Injectable,
	Scope,
	UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { Permission } from '../models/Permission';

@Injectable({ scope: Scope.REQUEST })
export class PermissionContext {
	readonly user?: AuthenticatedUserObject;

	constructor(@Inject(REQUEST) request: Request) {
		const { user } = request;

		if (user instanceof AuthenticatedUserObject) this.user = user;
	}

	hasPermission(permission: Permission): boolean {
		if (!this.user) return false;

		if (this.user.deleted) return false;

		return this.user.effectivePermissions.includes(permission);
	}

	get canViewDeletedEntries(): boolean {
		return this.hasPermission(Permission.ViewDeletedEntries);
	}

	get canViewHiddenEntries(): boolean {
		return this.hasPermission(Permission.ViewHiddenEntries);
	}

	verifyPermission(permission: Permission): void {
		if (!this.hasPermission(permission)) throw new UnauthorizedException();
	}
}
