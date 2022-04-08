import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { AuditedAction } from '../models/AuditedAction';
import { EntryType } from '../models/EntryType';
import { Artist } from './Artist';
import { Quote } from './Quote';
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
		oldValue: string;
		newValue: string;
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
		oldValue: string;
		newValue: string;
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

@Entity({
	tableName: 'audit_log_entries',
	discriminatorValue: EntryType.Artist,
})
export class ArtistAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	artist: Artist;

	constructor({
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
		artist,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue: string;
		newValue: string;
		artist: Artist;
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
	discriminatorValue: EntryType.Artist,
})
export class QuoteAuditLogEntry extends AuditLogEntry {
	@ManyToOne()
	quote: Quote;

	constructor({
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
		quote,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue: string;
		newValue: string;
		quote: Quote;
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
