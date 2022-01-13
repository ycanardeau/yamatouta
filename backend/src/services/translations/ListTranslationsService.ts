import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { TranslationObject } from '../../dto/translations/TranslationObject';
import { TranslationSortRule } from '../../dto/translations/TranslationSortRule';
import { Translation } from '../../entities/Translation';
import { TranslationSearchIndex } from '../../entities/TranslationSearchIndex';
import { NgramConverter } from '../../helpers/NgramConverter';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class ListTranslationsService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private orderBy(sort?: TranslationSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	private async getIds(query?: string): Promise<number[]> {
		const knex = this.em
			.createQueryBuilder(TranslationSearchIndex)
			.getKnex()
			.select('translation_id');

		if (query) {
			knex.andWhereRaw(
				'MATCH(headword, reading, yamatokotoba) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(query, 2),
			);
		}

		return _.map(await this.em.execute(knex), 'translation_id');
	}

	async listTranslations(params: {
		sort?: TranslationSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
		query?: string;
	}): Promise<SearchResultObject<TranslationObject>> {
		const { sort, offset, limit, getTotalCount, query } = params;

		const ids = await this.getIds(query);

		const where: FilterQuery<Translation> = {
			id: ids,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		};

		const options: FindOptions<Translation> = {
			limit: limit
				? Math.min(limit, ListTranslationsService.maxLimit)
				: ListTranslationsService.defaultLimit,
			offset: offset,
		};

		const [translations, count] = await Promise.all([
			offset && offset > ListTranslationsService.maxOffset
				? Promise.resolve([])
				: this.translationRepo.find(where, {
						...options,
						orderBy: this.orderBy(sort),
				  }),
			getTotalCount
				? this.translationRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject(
			translations.map(
				(translation) =>
					new TranslationObject(translation, this.permissionContext),
			),
			count,
		);
	}
}
