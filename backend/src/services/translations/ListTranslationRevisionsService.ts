import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ChangeLogEntryObject } from '../../dto/ChangeLogEntryObject';
import { SearchResultObject } from '../../dto/SearchResultObject';
import { TranslationChangeLogEntry } from '../../entities/ChangeLogEntry';
import { Translation } from '../../entities/Translation';
import { Permission } from '../../models/Permission';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class ListTranslationRevisionsService {
	constructor(
		private readonly permissionContext: PermissionContext,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		@InjectRepository(TranslationChangeLogEntry)
		private readonly changeLogEntryRepo: EntityRepository<TranslationChangeLogEntry>,
	) {}

	async listTranslationRevisions(
		translationId: number,
	): Promise<SearchResultObject<ChangeLogEntryObject>> {
		this.permissionContext.verifyPermission(Permission.ViewEditHistory);

		const translation = await this.translationRepo.findOneOrFail({
			id: translationId,
		});

		this.permissionContext.verifyDeletedAndHidden(translation);

		const changeLogEntries = await this.changeLogEntryRepo.find(
			{
				translation: translation,
			},
			{
				orderBy: { createdAt: QueryOrder.DESC },
				populate: ['actor' /*, 'changes'*/],
				fields: [
					'createdAt',
					'actor',
					'actionType',
					'translation',
					//'changes.key',
					'entryType',
				],
			},
		);

		return new SearchResultObject(
			changeLogEntries.map(
				(changeLogEntry) =>
					new ChangeLogEntryObject(
						changeLogEntry,
						this.permissionContext,
					),
			),
			changeLogEntries.length,
		);
	}
}
