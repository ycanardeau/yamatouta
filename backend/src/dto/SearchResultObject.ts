export class SearchResultObject<T> {
	private constructor(readonly items: T[], readonly totalCount: number) {}

	static create<T>(items: T[], totalCount: number): SearchResultObject<T> {
		return new SearchResultObject(items, totalCount);
	}
}
