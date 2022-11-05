export class SearchResultDto<T> {
	private constructor(readonly items: T[], readonly totalCount: number) {}

	static create<T>(items: T[], totalCount: number): SearchResultDto<T> {
		return new SearchResultDto(items, totalCount);
	}
}
