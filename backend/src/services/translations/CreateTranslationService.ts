import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { TranslationObject } from '../../dto/translations/TranslationObject';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { Permission } from '../../models/Permission';
import { WordCategory } from '../../models/WordCategory';
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
	) {}

	async createTranslation(params: {
		headword: string;
		locale?: string;
		reading?: string;
		yamatokotoba: string;
		category?: WordCategory;
		ip: string;
	}): Promise<TranslationObject> {
		this.permissionContext.verifyPermission(Permission.CreateTranslations);

		// TODO: Validate.

		const { headword, locale, reading, yamatokotoba, category, ip } =
			params;

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

			this.auditLogService.translation_create({
				actor: user,
				actorIp: ip,
				translation: translation,
			});

			return translation;
		});

		return new TranslationObject(translation, this.permissionContext);
	}
}
