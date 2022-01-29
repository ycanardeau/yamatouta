import {
	BadRequestException,
	Inject,
	Injectable,
	Scope,
	UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import requestIp from 'request-ip';

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { Permission } from '../models/Permission';

@Injectable({ scope: Scope.REQUEST })
export class PermissionContext {
	readonly remoteIpAddress: string;
	readonly user?: AuthenticatedUserObject;

	constructor(@Inject(REQUEST) request: Request) {
		const ip = requestIp.getClientIp(request);

		if (!ip) throw new BadRequestException('IP address cannot be found.');

		this.remoteIpAddress = ip;

		const { user } = request;

		if (!user) return;

		if (!(user instanceof AuthenticatedUserObject))
			throw new Error('user must be of type AuthenticatedUserObject.');

		this.user = user;
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
