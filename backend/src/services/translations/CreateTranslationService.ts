import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { TranslationObject } from '../../dto/translations/TranslationObject';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { NgramConverter } from '../../helpers/NgramConverter';
import { Permission } from '../../models/Permission';
import { ICreateTranslationBody } from '../../requests/translations/ICreateTranslationBody';
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
		params: ICreateTranslationBody,
	): Promise<TranslationObject> {
		this.permissionContext.verifyPermission(Permission.CreateTranslations);

		// TODO: Validate.

		const { headword, locale, reading, yamatokotoba, category } = params;

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

			const searchIndex = translation.createSearchIndex(
				this.ngramConverter,
			);

			em.persist(searchIndex);

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
