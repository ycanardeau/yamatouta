export class SearchResultDto<T> {
	_searchResultDtoBrand: any;

	private constructor(readonly items: T[], readonly totalCount: number) {}

	static create<T>(items: T[], totalCount: number): SearchResultDto<T> {
		return new SearchResultDto(items, totalCount);
	}
}
