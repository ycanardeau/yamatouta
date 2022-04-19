import { Injectable } from '@nestjs/common';

import {
	ArtistAuditLogEntry,
	QuoteAuditLogEntry,
	TranslationAuditLogEntry,
	UserAuditLogEntry,
	WorkAuditLogEntry,
} from '../entities/AuditLogEntry';
import { AuditedAction } from '../models/AuditedAction';
import { PermissionContext } from './PermissionContext';

@Injectable()
export class AuditLogEntryFactory {
	constructor(private readonly permissionContext: PermissionContext) {}

	private createArtistAuditLogEntry(
		params: Pick<
			ArtistAuditLogEntry,
			'artist' | 'action' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): ArtistAuditLogEntry {
		return new ArtistAuditLogEntry(params);
	}

	artist_create(
		params: Pick<ArtistAuditLogEntry, 'artist' | 'actor' | 'actorIp'>,
	): ArtistAuditLogEntry {
		return this.createArtistAuditLogEntry({
			...params,
			action: AuditedAction.Artist_Create,
			oldValue: '',
			newValue: '',
		});
	}

	artist_delete(
		params: Pick<ArtistAuditLogEntry, 'artist' | 'actor' | 'actorIp'>,
	): ArtistAuditLogEntry {
		return this.createArtistAuditLogEntry({
			...params,
			action: AuditedAction.Artist_Delete,
			oldValue: '',
			newValue: '',
		});
	}

	artist_update(
		params: Pick<ArtistAuditLogEntry, 'artist' | 'actor' | 'actorIp'>,
	): ArtistAuditLogEntry {
		return this.createArtistAuditLogEntry({
			...params,
			action: AuditedAction.Artist_Update,
			oldValue: '',
			newValue: '',
		});
	}

	private createQuoteAuditLogEntry(
		params: Pick<
			QuoteAuditLogEntry,
			'quote' | 'action' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): QuoteAuditLogEntry {
		return new QuoteAuditLogEntry(params);
	}

	quote_create(
		params: Pick<QuoteAuditLogEntry, 'quote' | 'actor' | 'actorIp'>,
	): QuoteAuditLogEntry {
		return this.createQuoteAuditLogEntry({
			...params,
			action: AuditedAction.Quote_Create,
			oldValue: '',
			newValue: '',
		});
	}

	quote_delete(
		params: Pick<QuoteAuditLogEntry, 'quote' | 'actor' | 'actorIp'>,
	): QuoteAuditLogEntry {
		return this.createQuoteAuditLogEntry({
			...params,
			action: AuditedAction.Quote_Delete,
			oldValue: '',
			newValue: '',
		});
	}

	quote_update(
		params: Pick<QuoteAuditLogEntry, 'quote' | 'actor' | 'actorIp'>,
	): QuoteAuditLogEntry {
		return this.createQuoteAuditLogEntry({
			...params,
			action: AuditedAction.Quote_Update,
			oldValue: '',
			newValue: '',
		});
	}

	private createTranslationAuditLogEntry(
		params: Pick<
			TranslationAuditLogEntry,
			| 'translation'
			| 'action'
			| 'actor'
			| 'actorIp'
			| 'oldValue'
			| 'newValue'
		>,
	): TranslationAuditLogEntry {
		return new TranslationAuditLogEntry(params);
	}

	translation_create(
		params: Pick<
			TranslationAuditLogEntry,
			'translation' | 'actor' | 'actorIp'
		>,
	): TranslationAuditLogEntry {
		return this.createTranslationAuditLogEntry({
			...params,
			action: AuditedAction.Translation_Create,
			oldValue: '',
			newValue: '',
		});
	}

	translation_delete(
		params: Pick<
			TranslationAuditLogEntry,
			'translation' | 'actor' | 'actorIp'
		>,
	): TranslationAuditLogEntry {
		return this.createTranslationAuditLogEntry({
			...params,
			action: AuditedAction.Translation_Delete,
			oldValue: '',
			newValue: '',
		});
	}

	translation_update(
		params: Pick<
			TranslationAuditLogEntry,
			'translation' | 'actor' | 'actorIp'
		>,
	): TranslationAuditLogEntry {
		return this.createTranslationAuditLogEntry({
			...params,
			action: AuditedAction.Translation_Update,
			oldValue: '',
			newValue: '',
		});
	}

	private createUserAuditLogEntry(
		params: Pick<
			UserAuditLogEntry,
			'user' | 'action' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): UserAuditLogEntry {
		return new UserAuditLogEntry(params);
	}

	user_changeEmail(
		params: Pick<
			UserAuditLogEntry,
			'user' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_ChangeEmail,
		});
	}

	user_changePassword(
		params: Pick<UserAuditLogEntry, 'user' | 'actor' | 'actorIp'>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_ChangePassword,
			oldValue: '',
			newValue: '',
		});
	}

	user_create(
		params: Pick<UserAuditLogEntry, 'user' | 'actor' | 'actorIp'>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_Create,
			oldValue: '',
			newValue: '',
		});
	}

	user_failedLogin(
		params: Pick<UserAuditLogEntry, 'user' | 'actor' | 'actorIp'>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_FailedLogin,
			oldValue: '',
			newValue: '',
		});
	}

	user_login(
		params: Pick<UserAuditLogEntry, 'user' | 'actor' | 'actorIp'>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_Login,
			oldValue: '',
			newValue: '',
		});
	}

	user_rename(
		params: Pick<
			UserAuditLogEntry,
			'user' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): UserAuditLogEntry {
		return this.createUserAuditLogEntry({
			...params,
			action: AuditedAction.User_Rename,
		});
	}

	private createWorkAuditLogEntry(
		params: Pick<
			WorkAuditLogEntry,
			'work' | 'action' | 'actor' | 'actorIp' | 'oldValue' | 'newValue'
		>,
	): WorkAuditLogEntry {
		return new WorkAuditLogEntry(params);
	}

	work_create(
		params: Pick<WorkAuditLogEntry, 'work' | 'actor' | 'actorIp'>,
	): WorkAuditLogEntry {
		return this.createWorkAuditLogEntry({
			...params,
			action: AuditedAction.Work_Create,
			oldValue: '',
			newValue: '',
		});
	}

	work_delete(
		params: Pick<WorkAuditLogEntry, 'work' | 'actor' | 'actorIp'>,
	): WorkAuditLogEntry {
		return this.createWorkAuditLogEntry({
			...params,
			action: AuditedAction.Work_Delete,
			oldValue: '',
			newValue: '',
		});
	}

	work_update(
		params: Pick<WorkAuditLogEntry, 'work' | 'actor' | 'actorIp'>,
	): WorkAuditLogEntry {
		return this.createWorkAuditLogEntry({
			...params,
			action: AuditedAction.Work_Update,
			oldValue: '',
			newValue: '',
		});
	}
}
