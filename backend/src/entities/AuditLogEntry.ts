import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { AuditedAction } from '../models/AuditedAction';
import { EntryType } from '../models/EntryType';
import { Translation } from './Translation';
import { User } from './User';

@Entity({
	tableName: 'audit_log_entries',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class AuditLogEntry {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Enum()
	action: AuditedAction;

	@ManyToOne()
	actor: User;

	@Property()
	actorIp: string;

	@Enum()
	entryType!: EntryType;

	@Property({ columnType: 'text' })
	oldValue?: string;

	@Property({ columnType: 'text' })
	newValue?: string;

	protected constructor({
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
	}) {
		this.action = action;
		this.actor = actor;
		this.actorIp = actorIp;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}
}

@Entity({ tableName: 'audit_log_entries', discriminatorValue: EntryType.User })
export class UserAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	user: User;

	constructor({
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
		user,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
		user: User;
	}) {
		super({
			action: action,
			actor: actor,
			actorIp: actorIp,
			oldValue: oldValue,
			newValue: newValue,
		});

		this.user = user;
	}
}

@Entity({
	tableName: 'audit_log_entries',
	discriminatorValue: EntryType.Translation,
})
export class TranslationAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	translation: Translation;

	constructor({
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
		translation,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
		translation: Translation;
	}) {
		super({
			action: action,
			actor: actor,
			actorIp: actorIp,
			oldValue: oldValue,
			newValue: newValue,
		});

		this.translation = translation;
	}
}
