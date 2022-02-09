import {
	TranslationAuditLogEntry,
	UserAuditLogEntry,
} from '../src/entities/AuditLogEntry';
import { Translation } from '../src/entities/Translation';
import { User } from '../src/entities/User';
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
