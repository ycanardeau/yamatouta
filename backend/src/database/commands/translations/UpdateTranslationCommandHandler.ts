import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { WebLinkObject } from '../../../dto/WebLinkObject';
import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Commit } from '../../../entities/Commit';
import { Translation } from '../../../entities/Translation';
import { Url } from '../../../entities/Url';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { TranslationOptionalFields } from '../../../models/TranslationOptionalFields';
import { WordCategory } from '../../../models/WordCategory';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { syncWebLinks } from '../entries/syncWebLinks';

export class UpdateTranslationParams {
	static readonly schema = Joi.object<UpdateTranslationParams>({
		translationId: Joi.number().optional(),
		headword: Joi.string().required().trim().max(200),
		locale: Joi.string().required().trim(),
		reading: Joi.string()
			.required()
			.trim()
			.max(200)
			.regex(/[あ-ん]/u),
		yamatokotoba: Joi.string()
			.required()
			.trim()
			.max(200)
			.regex(/[あ-ん]/u),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WordCategory)),
		webLinks: Joi.array().items(WebLinkObject.schema).required(),
	});

	constructor(
		readonly translationId: number | undefined,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly webLinks: WebLinkObject[],
	) {}
}

export class UpdateTranslationCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateTranslationParams,
	) {}
}

@CommandHandler(UpdateTranslationCommand)
export class UpdateTranslationCommandHandler
	implements ICommandHandler<UpdateTranslationCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		private readonly ngramConverter: NgramConverter,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async execute(
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.EditTranslations);

		const result = UpdateTranslationParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const { headword, locale, reading, yamatokotoba, category } =
			result.value;

		const translation = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const translation = await this.translationRepo.findOneOrFail(
				{
					id: params.translationId,
					deleted: false,
					hidden: false,
				},
				{ populate: true },
			);

			translation.headword = headword;
			translation.locale = locale;
			translation.reading = reading;
			translation.yamatokotoba = yamatokotoba;
			translation.category = category;

			translation.updateSearchIndex(this.ngramConverter);

			await syncWebLinks(
				translation,
				params.webLinks,
				async (url) =>
					(await em.findOne(Url, { url: url.href })) ?? new Url(url),
				async (oldItem) => {
					em.remove(oldItem);
				},
				permissionContext,
			);

			const commit = new Commit();

			const revision = translation.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.translation_update({
				translation: translation,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return translation;
		});

		return new TranslationObject(
			translation,
			permissionContext,
			Object.values(TranslationOptionalFields),
		);
	}
}
