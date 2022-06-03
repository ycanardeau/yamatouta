import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TranslationObject } from '../../../dto/TranslationObject';
import { TranslationAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Translation } from '../../../entities/Translation';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { TranslationOptionalField } from '../../../models/translations/TranslationOptionalField';
import { TranslationUpdateParams } from '../../../models/translations/TranslationUpdateParams';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { RevisionService } from '../../../services/RevisionService';
import { WebLinkService } from '../../../services/WebLinkService';
import { WorkLinkService } from '../../../services/WorkLinkService';

export class TranslationUpdateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: TranslationUpdateParams,
	) {}
}

@CommandHandler(TranslationUpdateCommand)
export class TranslationUpdateCommandHandler
	implements ICommandHandler<TranslationUpdateCommand>
{
	constructor(
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		private readonly webLinkService: WebLinkService,
		private readonly workLinkService: WorkLinkService,
		private readonly revisionService: RevisionService,
	) {}

	async execute(
		command: TranslationUpdateCommand,
	): Promise<TranslationObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.Translation_Update);

		const result = TranslationUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const translation = await this.em.transactional(async (em) => {
			const user = await permissionContext.getCurrentUser(em);

			const translation = isNew
				? new Translation(user)
				: await this.translationRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{
							// OPTIMIZE
							populate: [
								'webLinks',
								'webLinks.address',
								'webLinks.address.host',
								'workLinks',
								'workLinks.relatedWork',
							],
						},
				  );

			em.persist(translation);

			await this.revisionService.create(
				em,
				translation,
				async () => {
					translation.headword = params.headword;
					translation.locale = params.locale;
					translation.reading = params.reading;
					translation.yamatokotoba = params.yamatokotoba;
					translation.category = params.category;

					translation.updateSearchIndex(this.ngramConverter);

					await this.webLinkService.sync(
						em,
						translation,
						params.webLinks,
						permissionContext,
						user,
					);

					await this.workLinkService.sync(
						em,
						translation,
						params.workLinks,
						permissionContext,
					);
				},
				user,
				isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				false,
			);

			const auditLogEntry = new TranslationAuditLogEntry({
				action: isNew
					? AuditedAction.Translation_Create
					: AuditedAction.Translation_Update,
				translation: translation,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return translation;
		});

		return TranslationObject.create(
			translation,
			permissionContext,
			Object.values(TranslationOptionalField),
		);
	}
}
