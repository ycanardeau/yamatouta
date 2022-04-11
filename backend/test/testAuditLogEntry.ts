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

export const testUserAuditLogEntry = (
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
	expect(actual.actor).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.user).toBe(user);
};

export const testTranslationAuditLogEntry = (
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
	expect(actual.actor).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.translation).toBe(translation);
};

export const testArtistAuditLogEntry = (
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
	expect(actual.actor).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.artist).toBe(artist);
};

export const testQuoteAuditLogEntry = (
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
	expect(actual.actor).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.quote).toBe(quote);
};

export const testWorkAuditLogEntry = (
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
	expect(actual.actor).toBe(actor);
	expect(actual.actorIp).toBe(actorIp);
	expect(actual.oldValue).toBe(oldValue);
	expect(actual.newValue).toBe(newValue);
	expect(actual.work).toBe(work);
};
