import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IPaginationParams } from '@/stores/PaginationStore';

const collator = new Intl.Collator('ja');

export type Comparer<T> = (a: T, b: T) => number;

export const compareStrings = (a: string, b: string): number =>
	collator.compare(a, b);

export const by =
	<T>(
		selector: (item: T) => string | number,
		order: 'asc' | 'desc' = 'asc',
	): Comparer<T> =>
	(a, b): number => {
		const x = selector(a);
		const y = selector(b);
		const result =
			typeof x === 'string' && typeof y === 'string'
				? compareStrings(x, y)
				: x < y
				? -1
				: x > y
				? 1
				: 0;
		return order === 'asc' ? result : -result;
	};

// Items for which the predicate holds come first.
export const byPredicate =
	<T>(predicate: (item: T) => boolean): Comparer<T> =>
	(a, b): number =>
		Number(predicate(b)) - Number(predicate(a));

export const thenBy =
	<T>(...comparers: Comparer<T>[]): Comparer<T> =>
	(a, b): number => {
		for (const comparer of comparers) {
			const result = comparer(a, b);
			if (result !== 0) return result;
		}
		return 0;
	};

// Approximates the backend's n-gram full-text search: every
// whitespace-separated term must appear in at least one of the fields.
export const matchesQuery = (
	fields: (string | undefined)[],
	query: string | undefined,
): boolean => {
	const terms = query?.trim().toLowerCase().split(/\s+/).filter(Boolean);

	if (!terms || terms.length === 0) return true;

	const haystacks = fields.map((field) => (field ?? '').toLowerCase());

	return terms.every((term) =>
		haystacks.some((haystack) => haystack.includes(term)),
	);
};

export const paginate = <T>(
	items: T[],
	pagination: IPaginationParams,
): ISearchResultDto<T> => {
	return {
		items: items.slice(
			pagination.offset,
			pagination.offset + pagination.limit,
		),
		totalCount: items.length,
	};
};

export const emptyResult = <T>(): ISearchResultDto<T> => ({
	items: [],
	totalCount: 0,
});

export const readOnly = (): Promise<never> =>
	Promise.reject(new Error('This site is read-only.'));
