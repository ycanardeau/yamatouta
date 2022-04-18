import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Commit } from '../../../entities/Commit';
import { Translation } from '../../../entities/Translation';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { WordCategory } from '../../../models/WordCategory';
import { AuditLogger } from '../../AuditLogger';
import { NgramConverter } from '../../NgramConverter';
import { PermissionContext } from '../../PermissionContext';

export class UpdateTranslationCommand {
	static readonly schema: ObjectSchema<UpdateTranslationCommand> = Joi.object(
		{
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
		},
	);

	constructor(
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
	) {}
}

@Injectable()
export class UpdateTranslationCommandHandler {
	constructor(
		private readonly em: EntityManager,
		private readonly permissionContext: PermissionContext,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		private readonly ngramConverter: NgramConverter,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async execute(
		translationId: number,
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		this.permissionContext.verifyPermission(Permission.EditTranslations);

		const result = UpdateTranslationCommand.schema.validate(command, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const { headword, locale, reading, yamatokotoba, category } =
			result.value;

		const translation = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const translation = await this.translationRepo.findOneOrFail(
				{
					id: translationId,
					deleted: false,
					hidden: false,
				},
				{ populate: ['searchIndex'] },
			);

			translation.headword = headword;
			translation.locale = locale;
			translation.reading = reading;
			translation.yamatokotoba = yamatokotoba;
			translation.category = category;

			translation.updateSearchIndex(this.ngramConverter);

			const commit = new Commit();

			const revision = translation.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			this.auditLogger.translation_update({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				translation: translation,
			});

			return translation;
		});

		return new TranslationObject(translation, this.permissionContext);
	}
}
