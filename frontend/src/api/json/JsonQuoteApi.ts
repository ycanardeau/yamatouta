import { IQuoteApi } from '@/api/IQuoteApi';
import { IQuoteRow, findById, loadCollection } from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	emptyResult,
	matchesQuery,
	paginate,
	readOnly,
	thenBy,
} from '@/api/json/queryUtils';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
import { IPaginationParams } from '@/stores/PaginationStore';

type Row = IQuoteRow;

const bySortRule = (sort?: QuoteSortRule): Comparer<Row> => {
	switch (sort) {
		case QuoteSortRule.CreatedAsc:
			return thenBy(
				by((q) => q.createdAt, 'asc'),
				by((q) => q.id, 'asc'),
			);

		case QuoteSortRule.CreatedDesc:
		case undefined:
			return thenBy(
				by((q) => q.createdAt, 'desc'),
				by((q) => q.id, 'desc'),
			);

		case QuoteSortRule.UpdatedAsc:
			return thenBy(
				by((q) => q.updatedAt, 'asc'),
				by((q) => q.id, 'asc'),
			);

		case QuoteSortRule.UpdatedDesc:
			return thenBy(
				by((q) => q.updatedAt, 'desc'),
				by((q) => q.id, 'desc'),
			);
	}
};

const toDto = (row: Row, fields?: QuoteOptionalField[]): IQuoteDto => ({
	id: row.id,
	entryType: row.entryType,
	createdAt: row.createdAt,
	text: row.text,
	plainText: row.plainText,
	transcription: row.transcription,
	quoteType: row.quoteType,
	locale: row.locale,
	artist: row.artist,
	sourceUrl: row.sourceUrl,
	hashtagLinks: fields?.includes(QuoteOptionalField.HashtagLinks)
		? row.hashtagLinks ?? []
		: undefined,
	webLinks: fields?.includes(QuoteOptionalField.WebLinks)
		? row.webLinks ?? []
		: undefined,
	workLinks: fields?.includes(QuoteOptionalField.WorkLinks)
		? row.workLinks ?? []
		: undefined,
});

export class JsonQuoteApi implements IQuoteApi {
	create = readOnly;

	delete = readOnly;

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: QuoteOptionalField[];
	}): Promise<IQuoteDto> => {
		return toDto(await findById('quotes', id), fields);
	};

	list = async ({
		pagination,
		sort,
		query,
		quoteType,
		artistId,
		workId,
		hashtags,
	}: {
		pagination: IPaginationParams;
		sort?: QuoteSortRule;
		query?: string;
		quoteType?: QuoteType;
		artistId?: number;
		workId?: number;
		hashtags?: string[];
	}): Promise<ISearchResultDto<IQuoteDto>> => {
		const quotes = await loadCollection('quotes');

		const items = quotes
			.filter(
				(q) =>
					q.quoteType !== QuoteType.Word &&
					(!quoteType || q.quoteType === quoteType) &&
					(!artistId || q.artist.id === artistId) &&
					(!workId ||
						!!q.workLinks?.some(
							(link) => link.relatedWork.id === workId,
						)) &&
					(hashtags ?? []).every(
						(hashtag) =>
							!!q.hashtagLinks?.some(
								(link) => link.name === hashtag,
							),
					) &&
					matchesQuery([q.text, q.plainText, q.transcription], query),
			)
			.sort(bySortRule(sort));

		const result = paginate(items, pagination);

		return { ...result, items: result.items.map((q) => toDto(q)) };
	};

	listRevisions = async (): Promise<ISearchResultDto<IRevisionDto>> =>
		emptyResult();

	update = readOnly;
}
