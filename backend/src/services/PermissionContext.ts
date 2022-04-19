import {
	Inject,
	Injectable,
	NotFoundException,
	Scope,
	UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { IEntryWithDeletedAndHidden } from '../models/IEntryWithDeletedAndHidden';
import { Permission } from '../models/Permission';
import { getClientIp } from '../utils/getClientIp';
import { getUser } from '../utils/getUser';

@Injectable({ scope: Scope.REQUEST })
export class PermissionContext {
	readonly clientIp: string;
	readonly user?: AuthenticatedUserObject;

	constructor(@Inject(REQUEST) request: Request) {
		this.clientIp = getClientIp(request);
		this.user = getUser(request);
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

	verifyDeletedAndHidden(entry: IEntryWithDeletedAndHidden): void {
		if (entry.deleted && !this.canViewDeletedEntries)
			throw new NotFoundException();

		if (entry.hidden && !this.canViewHiddenEntries)
			throw new NotFoundException();
	}
}
