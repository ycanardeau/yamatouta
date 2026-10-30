import { IHashtagApi } from '@/api/IHashtagApi';
import { NotFoundError, loadCollection } from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	matchesQuery,
	paginate,
	thenBy,
} from '@/api/json/queryUtils';
import { IHashtagDto } from '@/dto/IHashtagDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';

// Hashtags have no collection of their own; they are derived from the
// hashtag links of quotes.
const loadHashtags = async (): Promise<IHashtagDto[]> => {
	const quotes = await loadCollection('quotes');

	const referenceCounts = new Map<string, number>();
	for (const quote of quotes) {
		for (const { name } of quote.hashtagLinks ?? []) {
			referenceCounts.set(name, (referenceCounts.get(name) ?? 0) + 1);
		}
	}

	return Array.from(referenceCounts, ([name, referenceCount]) => ({
		name,
		referenceCount,
	}));
};

const bySortRule = (sort?: HashtagSortRule): Comparer<IHashtagDto> => {
	switch (sort) {
		case HashtagSortRule.NameAsc:
			return by((h) => h.name, 'asc');

		case HashtagSortRule.NameDesc:
			return by((h) => h.name, 'desc');

		case HashtagSortRule.ReferenceCountAsc:
			return thenBy(
				by((h) => h.referenceCount, 'asc'),
				by((h) => h.name, 'asc'),
			);

		case HashtagSortRule.ReferenceCountDesc:
		case undefined:
			return thenBy(
				by((h) => h.referenceCount, 'desc'),
				by((h) => h.name, 'asc'),
			);
	}
};

export class JsonHashtagApi implements IHashtagApi {
	get = async ({ name }: { name: string }): Promise<IHashtagDto> => {
		const hashtags = await loadHashtags();
		const hashtag = hashtags.find((h) => h.name === name);

		if (!hashtag) throw new NotFoundError('hashtags', name);

		return hashtag;
	};

	list = async ({
		pagination,
		sort,
		query,
	}: {
		pagination: IPaginationParams;
		sort?: HashtagSortRule;
		query?: string;
	}): Promise<ISearchResultDto<IHashtagDto>> => {
		const hashtags = await loadHashtags();

		const items = hashtags
			.filter((h) => matchesQuery([h.name], query))
			.sort(bySortRule(sort));

		return paginate(items, pagination);
	};
}
