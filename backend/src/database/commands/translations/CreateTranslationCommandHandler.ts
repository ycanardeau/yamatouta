import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Commit } from '../../../entities/Commit';
import { Translation } from '../../../entities/Translation';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { TranslationOptionalFields } from '../../../models/TranslationOptionalFields';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateTranslationParams } from './UpdateTranslationCommandHandler';

export class CreateTranslationCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateTranslationParams,
	) {}
}

@CommandHandler(CreateTranslationCommand)
export class CreateTranslationCommandHandler
	implements ICommandHandler<CreateTranslationCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		private readonly ngramConverter: NgramConverter,
	) {}

	async execute(
		command: CreateTranslationCommand,
	): Promise<TranslationObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.CreateTranslations);

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

			const translation = new Translation({
				translatedString: {
					headword: headword,
					locale: locale,
					reading: reading,
					yamatokotoba: yamatokotoba,
				},
				category: category,
				user: user,
			});

			em.persist(translation);

			translation.updateSearchIndex(this.ngramConverter);

			const commit = new Commit();

			const revision = translation.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Created,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.translation_create({
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
