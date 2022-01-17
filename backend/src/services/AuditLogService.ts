import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { AuditLogEntry } from '../entities/AuditLogEntry';
import { Translation } from '../entities/Translation';
import { User } from '../entities/User';
import { AuditedAction } from '../models/AuditedAction';

@Injectable()
export class AuditLogService {
	constructor(private readonly em: EntityManager) {}

	private createAuditLogEntry(params: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		user?: User;
		translation?: Translation;
	}): void {
		this.em.persist(new AuditLogEntry(params));
	}

	user_create(params: { actor: User; actorIp: string; user: User }): void {
		this.createAuditLogEntry({
			...params,
			action: AuditedAction.User_Create,
		});
	}

	user_failedLogin(params: {
		actor: User;
		actorIp: string;
		user: User;
	}): void {
		this.createAuditLogEntry({
			...params,
			action: AuditedAction.User_FailedLogin,
		});
	}

	user_login(params: { actor: User; actorIp: string; user: User }): void {
		this.createAuditLogEntry({
			...params,
			action: AuditedAction.User_Login,
		});
	}

	translation_create(params: {
		actor: User;
		actorIp: string;
		translation: Translation;
	}): void {
		this.createAuditLogEntry({
			...params,
			action: AuditedAction.Translation_Create,
		});
	}
}
