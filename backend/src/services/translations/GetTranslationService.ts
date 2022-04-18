import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { TranslationObject } from '../../dto/translations/TranslationObject';
import { Translation } from '../../entities/Translation';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class GetTranslationService {
	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(translationId: number): Promise<TranslationObject> {
		const translation = await this.translationRepo.findOne({
			id: translationId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!translation) throw new NotFoundException();

		return new TranslationObject(translation, this.permissionContext);
	}
}
