import { ITranslationApi } from '@/api/ITranslationApi';
import {
	ITranslationRow,
	findById,
	loadCollection,
} from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	byPredicate,
	emptyResult,
	matchesQuery,
	paginate,
	readOnly,
	thenBy,
} from '@/api/json/queryUtils';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import { IPaginationParams } from '@/stores/PaginationStore';

type Row = ITranslationRow;

const byHeadword = (order: 'asc' | 'desc'): Comparer<Row> =>
	thenBy(
		by((t) => t.reading, order),
		by((t) => t.headword, order),
	);

const byYamatokotoba = (order: 'asc' | 'desc'): Comparer<Row> =>
	by((t) => t.yamatokotoba, order);

// Mirrors TranslationListQueryHandler.orderByQuery: exact matches first, then
// prefix matches, prioritizing the field being sorted by.
const byQuery = (query: string, sort?: TranslationSortRule): Comparer<Row> => {
	const headwordExact = byPredicate<Row>(
		(t) => t.headword === query || t.reading === query,
	);
	const yamatokotobaExact = byPredicate<Row>((t) => t.yamatokotoba === query);
	const headwordPrefix = byPredicate<Row>(
		(t) => t.headword.startsWith(query) || t.reading.startsWith(query),
	);
	const yamatokotobaPrefix = byPredicate<Row>((t) =>
		t.yamatokotoba.startsWith(query),
	);

	switch (sort) {
		case TranslationSortRule.YamatokotobaAsc:
		case TranslationSortRule.YamatokotobaDesc:
			return thenBy(
				yamatokotobaExact,
				headwordExact,
				yamatokotobaPrefix,
				headwordPrefix,
			);

		default:
			return thenBy(
				headwordExact,
				yamatokotobaExact,
				headwordPrefix,
				yamatokotobaPrefix,
			);
	}
};

const bySortRule = (sort?: TranslationSortRule): Comparer<Row> => {
	switch (sort) {
		case TranslationSortRule.HeadwordAsc:
		case undefined:
			return thenBy(byHeadword('asc'), byYamatokotoba('asc'));

		case TranslationSortRule.HeadwordDesc:
			return thenBy(byHeadword('desc'), byYamatokotoba('desc'));

		case TranslationSortRule.YamatokotobaAsc:
			return thenBy(byYamatokotoba('asc'), byHeadword('asc'));

		case TranslationSortRule.YamatokotobaDesc:
			return thenBy(byYamatokotoba('desc'), byHeadword('desc'));

		case TranslationSortRule.CreatedAsc:
			return thenBy(
				by((t) => t.createdAt, 'asc'),
				by((t) => t.id, 'asc'),
			);

		case TranslationSortRule.CreatedDesc:
			return thenBy(
				by((t) => t.createdAt, 'desc'),
				by((t) => t.id, 'desc'),
			);

		case TranslationSortRule.UpdatedAsc:
			return thenBy(
				by((t) => t.updatedAt, 'asc'),
				by((t) => t.id, 'asc'),
			);

		case TranslationSortRule.UpdatedDesc:
			return thenBy(
				by((t) => t.updatedAt, 'desc'),
				by((t) => t.id, 'desc'),
			);
	}
};

const toDto = (
	row: Row,
	fields?: TranslationOptionalField[],
): ITranslationDto => ({
	id: row.id,
	entryType: row.entryType,
	createdAt: row.createdAt,
	headword: row.headword,
	locale: row.locale,
	reading: row.reading,
	yamatokotoba: row.yamatokotoba,
	category: row.category,
	webLinks: fields?.includes(TranslationOptionalField.WebLinks)
		? row.webLinks ?? []
		: undefined,
	workLinks: fields?.includes(TranslationOptionalField.WorkLinks)
		? row.workLinks ?? []
		: undefined,
});

export class JsonTranslationApi implements ITranslationApi {
	create = readOnly;

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: TranslationOptionalField[];
	}): Promise<ITranslationDto> => {
		return toDto(await findById('translations', id), fields);
	};

	delete = readOnly;

	list = async ({
		pagination,
		sort,
		query,
		category,
	}: {
		pagination: IPaginationParams;
		sort?: TranslationSortRule;
		query?: string;
		category?: WordCategory;
	}): Promise<ISearchResultDto<ITranslationDto>> => {
		const translations = await loadCollection('translations');

		const trimmedQuery = query?.trim();

		const items = translations
			.filter(
				(t) =>
					(!category || t.category === category) &&
					matchesQuery(
						[t.headword, t.reading, t.yamatokotoba],
						trimmedQuery,
					),
			)
			.sort(
				trimmedQuery
					? thenBy(byQuery(trimmedQuery, sort), bySortRule(sort))
					: bySortRule(sort),
			);

		const result = paginate(items, pagination);

		return { ...result, items: result.items.map((t) => toDto(t)) };
	};

	listRevisions = async (): Promise<ISearchResultDto<IRevisionDto>> =>
		emptyResult();

	update = readOnly;
}
