import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { TranslationObject } from '../../dto/translations/TranslationObject';
import { Revision } from '../../entities/Revision';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { NgramConverter } from '../../helpers/NgramConverter';
import { ChangeLogEvent } from '../../models/ChangeLogEvent';
import { TranslationDiff } from '../../models/EntryDiff';
import { Permission } from '../../models/Permission';
import {
	IUpdateTranslationBody,
	updateTranslationBodySchema,
} from '../../requests/translations/IUpdateTranslationBody';
import { AuditLogService } from '../AuditLogService';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class UpdateTranslationService {
	constructor(
		private readonly em: EntityManager,
		private readonly permissionContext: PermissionContext,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogService: AuditLogService,
		private readonly ngramConverter: NgramConverter,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async updateTranslation(
		translationId: number,
		params: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		this.permissionContext.verifyPermission(Permission.EditTranslations);

		const result = updateTranslationBodySchema.validate(params, {
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

			const revision = new Revision();

			em.persist(revision);

			const diff: TranslationDiff = {
				Translation_Headword:
					headword !== translation.headword ? headword : undefined,
				Translation_Locale:
					locale !== translation.locale ? locale : undefined,
				Translation_Reading:
					reading !== translation.reading ? reading : undefined,
				Translation_Yamatokotoba:
					yamatokotoba !== translation.yamatokotoba
						? yamatokotoba
						: undefined,
				Translation_Category:
					category !== translation.category ? category : undefined,
			};

			const changeLogEntry = translation
				.createChangeLogEntry({
					revision: revision,
					actor: user,
					actionType: ChangeLogEvent.Updated,
					text: '',
				})
				.addChanges(diff);

			revision.changeLogEntries.add(changeLogEntry);

			translation.headword = headword;
			translation.locale = locale;
			translation.reading = reading;
			translation.yamatokotoba = yamatokotoba;
			translation.category = category;

			translation.updateSearchIndex(this.ngramConverter);

			this.auditLogService.translation_update({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				translation: translation,
			});

			return translation;
		});

		return new TranslationObject(translation, this.permissionContext);
	}
}
