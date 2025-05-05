import { orderByIds } from '@/database/queries/orderByIds';
import { SearchResultDto } from '@/dto/SearchResultDto';
import { TranslationDto } from '@/dto/TranslationDto';
import { Translation } from '@/entities/Translation';
import { TranslationListParams } from '@/models/translations/TranslationListParams';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

export class TranslationListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: TranslationListParams,
	) {}
}

@QueryHandler(TranslationListQuery)
export class TranslationListQueryHandler
	implements IQueryHandler<TranslationListQuery>
{
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: TranslationListParams): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(Translation)
			.getKnex()
			.andWhere('translations.deleted', false)
			.andWhere('translations.hidden', false);

		if (params.query) {
			knex.join(
				'translation_search_index',
				'translations.id',
				'translation_search_index.translation_id',
			).andWhereRaw(
				'MATCH(translation_search_index.headword, translation_search_index.reading, translation_search_index.yamatokotoba) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(params.query, 2),
			);
		}

		if (params.category)
			knex.andWhere('translations.category', params.category);

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: TranslationListParams,
	): Knex.QueryBuilder {
		return knex.orderBy('translations.id', 'asc');
	}

	private async getIds(params: TranslationListParams): Promise<number[]> {
		const knex = this.createKnex(params)
			.select('translations.id');

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(
		params: TranslationListParams,
	): Promise<Translation[]> {
		/*if (
			params.offset &&
			params.offset > TranslationListQueryHandler.maxOffset
		) {
			return [];
		}*/

		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Translation)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Translation, result));
	}

	private async getCount(params: TranslationListParams): Promise<number> {
		if (!params.getTotalCount) return 0;

		const knex = this.createKnex(params).countDistinct(
			'translations.id as count',
		);

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		query: TranslationListQuery,
	): Promise<SearchResultDto<TranslationDto>> {
		const { permissionContext, params } = query;

		const result = TranslationListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const [translations, count] = await Promise.all([
			this.getItems(params),
			this.getCount(params),
		]);

		return SearchResultDto.create(
			translations.map((translation) =>
				TranslationDto.create(permissionContext, translation),
			),
			count,
		);
	}
}
