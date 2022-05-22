import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { AuditedAction } from '../models/AuditedAction';
import { EntryType } from '../models/EntryType';
import { Artist } from './Artist';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { User } from './User';
import { Work } from './Work';

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
	oldValue: string;

	@Property({ columnType: 'text' })
	newValue: string;

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
		oldValue: string;
		newValue: string;
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
		user,
		action,
		actor,
		actorIp,
		oldValue = '',
		newValue = '',
	}: {
		user: User;
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
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
		translation,
		action,
		actor,
		actorIp,
		oldValue = '',
		newValue = '',
	}: {
		translation: Translation;
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
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

@Entity({
	tableName: 'audit_log_entries',
	discriminatorValue: EntryType.Artist,
})
export class ArtistAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	artist: Artist;

	constructor({
		artist,
		action,
		actor,
		actorIp,
		oldValue = '',
		newValue = '',
	}: {
		artist: Artist;
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
	}) {
		super({
			action: action,
			actor: actor,
			actorIp: actorIp,
			oldValue: oldValue,
			newValue: newValue,
		});

		this.artist = artist;
	}
}

@Entity({
	tableName: 'audit_log_entries',
	discriminatorValue: EntryType.Quote,
})
export class QuoteAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	quote: Quote;

	constructor({
		quote,
		action,
		actor,
		actorIp,
		oldValue = '',
		newValue = '',
	}: {
		quote: Quote;
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
	}) {
		super({
			action: action,
			actor: actor,
			actorIp: actorIp,
			oldValue: oldValue,
			newValue: newValue,
		});

		this.quote = quote;
	}
}

@Entity({
	tableName: 'audit_log_entries',
	discriminatorValue: EntryType.Work,
})
export class WorkAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		action,
		actor,
		actorIp,
		oldValue = '',
		newValue = '',
	}: {
		work: Work;
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue?: string;
		newValue?: string;
	}) {
		super({
			action: action,
			actor: actor,
			actorIp: actorIp,
			oldValue: oldValue,
			newValue: newValue,
		});

		this.work = work;
	}
}
