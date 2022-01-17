import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { TranslationObject } from '../../dto/translations/TranslationObject';
import { TranslationSortRule } from '../../dto/translations/TranslationSortRule';
import { Translation } from '../../entities/Translation';
import { NgramConverter } from '../../helpers/NgramConverter';
import { IListTranslationsQuery } from '../../requests/translations/IListTranslationsQuery';
import { escapeWildcardCharacters } from '../../utils/escapeWildcardCharacters';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class ListTranslationsService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Translation)
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: IListTranslationsQuery): Knex.QueryBuilder {
		const { query } = params;

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
			case TranslationSortRule.YaamtokotobaDesc:
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

			case TranslationSortRule.YaamtokotobaDesc:
				this.orderByYamatokotoba(knex, 'desc');
				this.orderByHeadword(knex, 'desc');
				return knex;
		}
	}

	private orderByIds(
		knex: Knex.QueryBuilder,
		ids: number[],
	): Knex.QueryBuilder {
		if (ids.length === 0) return knex;

		return knex.orderByRaw(
			`field(id, ${Array(ids.length).fill('?').join(', ')})`,
			ids,
		);
	}

	private async getIds(params: IListTranslationsQuery): Promise<number[]> {
		const { offset, limit } = params;

		const knex = this.createKnex(params)
			.select('translations.id')
			.limit(
				limit
					? Math.min(limit, ListTranslationsService.maxLimit)
					: ListTranslationsService.defaultLimit,
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
		const { getTotalCount } = params;

		if (!getTotalCount) return 0;

		const knex = this.createKnex(params).count('translations.id');

		const count = _.map(
			await this.em.execute(knex),
			'count(`translations`.`id`)',
		)[0];

		return count;
	}

	async listTranslations(
		params: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		const { offset } = params;

		const [translations, count] = await Promise.all([
			offset && offset > ListTranslationsService.maxOffset
				? Promise.resolve([])
				: this.getItems(params),
			this.getCount(params),
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
