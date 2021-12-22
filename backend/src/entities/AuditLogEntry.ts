import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './User';

export enum AuditedAction {
	User_Create = 'user.create',
	User_FailedLogin = 'user.failed_login',
	User_Login = 'user.login',
}

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
	actorName: string;

	@Property()
	actorIp: string;

	@ManyToOne()
	user?: User;

	@Property()
	userName?: string;

	constructor(params: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		user?: User;
	}) {
		const { action, actor, actorIp, user } = params;

		this.action = action;
		this.actor = actor;
		this.actorName = actor.name;
		this.actorIp = actorIp;
		this.user = user;
		this.userName = user?.name;
	}
}
