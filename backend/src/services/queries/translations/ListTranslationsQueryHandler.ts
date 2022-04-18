import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Translation } from '../../../entities/Translation';
import { TranslationSortRule } from '../../../models/TranslationSortRule';
import { IListTranslationsQuery } from '../../../requests/translations/IListTranslationsQuery';
import { escapeWildcardCharacters } from '../../../utils/escapeWildcardCharacters';
import { NgramConverter } from '../../NgramConverter';
import { PermissionContext } from '../../PermissionContext';

@Injectable()
export class ListTranslationsQueryHandler {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: IListTranslationsQuery): Knex.QueryBuilder {
		const { query, category } = params;

		const knex = this.em
			.createQueryBuilder(Translation)
			.getKnex()
			.join(
				'translation_search_index',
				'translations.id',
				'translation_search_index.translation_id',
			)
			.andWhere('translations.deleted', false)
			.andWhere('translations.hidden', false);

		if (query) {
			knex.andWhereRaw(
				'MATCH(translation_search_index.headword, translation_search_index.reading, translation_search_index.yamatokotoba) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(query, 2),
			);
		}

		if (category) knex.andWhere('translations.category', category);

		return knex;
	}

	private orderByHeadwordExact(
		knex: Knex.QueryBuilder,
		query: string,
	): Knex.QueryBuilder {
		return knex.orderByRaw(
			'translations.headword = ? or translations.reading = ? desc',
			[query, query],
		);
	}

	private orderByYamatokotobaExact(
		knex: Knex.QueryBuilder,
		query: string,
	): Knex.QueryBuilder {
		return knex.orderByRaw('translations.yamatokotoba = ? desc', query);
	}

	private orderByHeadwordPrefix(
		knex: Knex.QueryBuilder,
		query: string,
	): Knex.QueryBuilder {
		const prefixSearchQuery = `${escapeWildcardCharacters(query)}%`;

		return knex.orderByRaw(
			'translations.headword like ? or translations.reading like ? desc',
			[prefixSearchQuery, prefixSearchQuery],
		);
	}

	private orderByYamatokotobaPrefix(
		knex: Knex.QueryBuilder,
		query: string,
	): Knex.QueryBuilder {
		const prefixSearchQuery = `${escapeWildcardCharacters(query)}%`;

		return knex.orderByRaw(
			'translations.yamatokotoba like ? desc',
			prefixSearchQuery,
		);
	}

	private orderByQuery(
		knex: Knex.QueryBuilder,
		params: IListTranslationsQuery,
	): Knex.QueryBuilder {
		const { query, sort } = params;

		if (!query) return knex;

		switch (sort) {
			case TranslationSortRule.HeadwordAsc:
			case TranslationSortRule.HeadwordDesc:
			default:
				this.orderByHeadwordExact(knex, query);
				this.orderByYamatokotobaExact(knex, query);
				this.orderByHeadwordPrefix(knex, query);
				this.orderByYamatokotobaPrefix(knex, query);
				return knex;

			case TranslationSortRule.YamatokotobaAsc:
			case TranslationSortRule.YamatokotobaDesc:
				this.orderByYamatokotobaExact(knex, query);
				this.orderByHeadwordExact(knex, query);
				this.orderByYamatokotobaPrefix(knex, query);
				this.orderByHeadwordPrefix(knex, query);
				return knex;
		}
	}

	private orderByHeadword(
		knex: Knex.QueryBuilder,
		order: 'asc' | 'desc',
	): Knex.QueryBuilder {
		switch (order) {
			case 'asc':
				return knex
					.orderBy('translations.reading', 'asc')
					.orderBy('translations.headword', 'asc');

			case 'desc':
				return knex
					.orderBy('translations.reading', 'desc')
					.orderBy('translations.headword', 'desc');
		}
	}

	private orderByYamatokotoba(
		knex: Knex.QueryBuilder,
		order: 'asc' | 'desc',
	): Knex.QueryBuilder {
		switch (order) {
			case 'asc':
				return knex.orderBy('translations.yamatokotoba', 'asc');

			case 'desc':
				return knex.orderBy('translations.yamatokotoba', 'desc');
		}
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: IListTranslationsQuery,
	): Knex.QueryBuilder {
		const { sort } = params;

		this.orderByQuery(knex, params);

		switch (sort) {
			case TranslationSortRule.HeadwordAsc:
			default:
				this.orderByHeadword(knex, 'asc');
				this.orderByYamatokotoba(knex, 'asc');
				return knex;

			case TranslationSortRule.HeadwordDesc:
				this.orderByHeadword(knex, 'desc');
				this.orderByYamatokotoba(knex, 'desc');
				return knex;

			case TranslationSortRule.YamatokotobaAsc:
				this.orderByYamatokotoba(knex, 'asc');
				this.orderByHeadword(knex, 'asc');
				return knex;

			case TranslationSortRule.YamatokotobaDesc:
				this.orderByYamatokotoba(knex, 'desc');
				this.orderByHeadword(knex, 'desc');
				return knex;

			case TranslationSortRule.CreatedAsc:
				return knex
					.orderBy('translations.created_at', 'asc')
					.orderBy('translations.id', 'asc');

			case TranslationSortRule.CreatedDesc:
				return knex
					.orderBy('translations.created_at', 'desc')
					.orderBy('translations.id', 'desc');

			case TranslationSortRule.UpdatedAsc:
				return knex
					.orderBy('translations.updated_at', 'asc')
					.orderBy('translations.id', 'asc');

			case TranslationSortRule.UpdatedDesc:
				return knex
					.orderBy('translations.updated_at', 'desc')
					.orderBy('translations.id', 'desc');
		}
	}

	private orderByIds(
		knex: Knex.QueryBuilder,
		ids: number[],
	): Knex.QueryBuilder {
		if (ids.length === 0) return knex;

		// Yields `field(id, ?, ?, ..., ?)`.
		const sql = `field(id, ${Array(ids.length).fill('?').join(', ')})`;

		return knex.orderByRaw(sql, ids);
	}

	private async getIds(params: IListTranslationsQuery): Promise<number[]> {
		const { offset, limit } = params;

		const knex = this.createKnex(params)
			.select('translations.id')
			.limit(
				limit
					? Math.min(limit, ListTranslationsQueryHandler.maxLimit)
					: ListTranslationsQueryHandler.defaultLimit,
			);

		if (offset) knex.offset(offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(
		params: IListTranslationsQuery,
	): Promise<Translation[]> {
		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Translation)
			.getKnex()
			.whereIn('id', ids);

		this.orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((translation) =>
			this.em.map(Translation, translation),
		);
	}

	private async getCount(params: IListTranslationsQuery): Promise<number> {
		const knex = this.createKnex(params).countDistinct(
			'translations.id as count',
		);

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		params: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		const { /*offset, */ getTotalCount } = params;

		const [translations, count] = await Promise.all([
			/*offset && offset > ListTranslationsService.maxOffset
				? Promise.resolve([])
				: */ this.getItems(params),
			getTotalCount ? this.getCount(params) : Promise.resolve(0),
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
