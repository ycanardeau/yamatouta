import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { AuditedAction } from '../models/AuditedAction';
import { Translation } from './Translation';
import { User } from './User';

@Entity({ tableName: 'audit_log_entries' })
export class AuditLogEntry {
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

	@ManyToOne()
	user?: User;

	@ManyToOne()
	translation?: Translation;

	@Property({ columnType: 'text' })
	oldValue?: string;

	@Property({ columnType: 'text' })
	newValue?: string;

	constructor(params: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		user?: User;
		translation?: Translation;
		oldValue?: string;
		newValue?: string;
	}) {
		const {
			action,
			actor,
			actorIp,
			user,
			translation,
			oldValue,
			newValue,
		} = params;

		this.action = action;
		this.actor = actor;
		this.actorIp = actorIp;
		this.user = user;
		this.translation = translation;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}
}
