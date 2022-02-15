import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import {
	AuditLogEntry,
	TranslationAuditLogEntry,
	UserAuditLogEntry,
} from '../entities/AuditLogEntry';
import { Translation } from '../entities/Translation';
import { User } from '../entities/User';
import { AuditedAction } from '../models/AuditedAction';

@Injectable()
export class AuditLogService {
	constructor(private readonly em: EntityManager) {}

	private createAuditLogEntry(auditLogEntry: AuditLogEntry): void {
		this.em.persist(auditLogEntry);
	}

	user_create(params: { actor: User; actorIp: string; user: User }): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_Create,
			}),
		);
	}

	user_failedLogin(params: {
		actor: User;
		actorIp: string;
		user: User;
	}): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_FailedLogin,
			}),
		);
	}

	user_login(params: { actor: User; actorIp: string; user: User }): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_Login,
			}),
		);
	}

	translation_create(params: {
		actor: User;
		actorIp: string;
		translation: Translation;
	}): void {
		this.createAuditLogEntry(
			new TranslationAuditLogEntry({
				...params,
				action: AuditedAction.Translation_Create,
			}),
		);
	}

	user_rename(params: {
		actor: User;
		actorIp: string;
		user: User;
		oldValue: string;
		newValue: string;
	}): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_Rename,
			}),
		);
	}

	user_changeEmail(params: {
		actor: User;
		actorIp: string;
		user: User;
		oldValue: string;
		newValue: string;
	}): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_ChangeEmail,
			}),
		);
	}

	user_changePassword(params: {
		actor: User;
		actorIp: string;
		user: User;
	}): void {
		this.createAuditLogEntry(
			new UserAuditLogEntry({
				...params,
				action: AuditedAction.User_ChangePassword,
			}),
		);
	}
}
