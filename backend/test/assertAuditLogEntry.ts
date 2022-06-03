import { Artist } from '../src/entities/Artist';
import {
	ArtistAuditLogEntry,
	QuoteAuditLogEntry,
	TranslationAuditLogEntry,
	UserAuditLogEntry,
	WorkAuditLogEntry,
} from '../src/entities/AuditLogEntry';
import { Quote } from '../src/entities/Quote';
import { Translation } from '../src/entities/Translation';
import { User } from '../src/entities/User';
import { Work } from '../src/entities/Work';
import { AuditedAction } from '../src/models/AuditedAction';

export const assertUserAuditLogEntry = (
	actual: UserAuditLogEntry,
	{
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
	},
): void => {
	expect(actual).toBeInstanceOf(UserAuditLogEntry);
	expect(actual.action).toBe(action);
	expect(actual.actor.getEntity()).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.user.getEntity()).toBe(user);
};

export const assertTranslationAuditLogEntry = (
	actual: TranslationAuditLogEntry,
	{
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
	},
): void => {
	expect(actual).toBeInstanceOf(TranslationAuditLogEntry);
	expect(actual.action).toBe(action);
	expect(actual.actor.getEntity()).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.translation.getEntity()).toBe(translation);
};

export const assertArtistAuditLogEntry = (
	actual: ArtistAuditLogEntry,
	{
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
	},
): void => {
	expect(actual).toBeInstanceOf(ArtistAuditLogEntry);
	expect(actual.action).toBe(action);
	expect(actual.actor.getEntity()).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.artist.getEntity()).toBe(artist);
};

export const assertQuoteAuditLogEntry = (
	actual: QuoteAuditLogEntry,
	{
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
	},
): void => {
	expect(actual).toBeInstanceOf(QuoteAuditLogEntry);
	expect(actual.action).toBe(action);
	expect(actual.actor.getEntity()).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.quote.getEntity()).toBe(quote);
};

export const assertWorkAuditLogEntry = (
	actual: WorkAuditLogEntry,
	{
		action,
		actor,
		actorIp,
		oldValue,
		newValue,
		work,
	}: {
		action: AuditedAction;
		actor: User;
		actorIp: string;
		oldValue: string;
		newValue: string;
		work: Work;
	},
): void => {
	expect(actual).toBeInstanceOf(WorkAuditLogEntry);
	expect(actual.action).toBe(action);
	expect(actual.actor.getEntity()).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.work.getEntity()).toBe(work);
};
