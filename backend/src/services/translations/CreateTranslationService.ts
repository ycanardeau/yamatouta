import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { TranslationObject } from '../../dto/translations/TranslationObject';
import { Revision } from '../../entities/Revision';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { NgramConverter } from '../../helpers/NgramConverter';
import { ChangeLogChangeKey } from '../../models/ChangeLogChangeKey';
import { ChangeLogEvent } from '../../models/ChangeLogEvent';
import { Permission } from '../../models/Permission';
import {
	IUpdateTranslationBody,
	updateTranslationBodySchema,
} from '../../requests/translations/IUpdateTranslationBody';
import { AuditLogService } from '../AuditLogService';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class CreateTranslationService {
	constructor(
		private readonly em: EntityManager,
		private readonly permissionContext: PermissionContext,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogService: AuditLogService,
		private readonly ngramConverter: NgramConverter,
	) {}

	async createTranslation(
		params: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		this.permissionContext.verifyPermission(Permission.CreateTranslations);

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

			const revision = new Revision();

			em.persist(revision);

			const changeLogEntry = translation
				.createChangeLogEntry({
					revision: revision,
					actor: user,
					actionType: ChangeLogEvent.Created,
					text: '',
				})
				.addChanges(
					{
						key: ChangeLogChangeKey.Translation_Headword,
						value: headword,
					},
					{
						key: ChangeLogChangeKey.Translation_Locale,
						value: locale,
					},
					{
						key: ChangeLogChangeKey.Translation_Reading,
						value: reading,
					},
					{
						key: ChangeLogChangeKey.Translation_Yamatokotoba,
						value: yamatokotoba,
					},
					{
						key: ChangeLogChangeKey.Translation_Category,
						value: category,
					},
				);

			revision.changeLogEntries.add(changeLogEntry);

			translation.updateSearchIndex(this.ngramConverter);

			this.auditLogService.translation_create({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				translation: translation,
			});

			return translation;
		});

		return new TranslationObject(translation, this.permissionContext);
	}
}
