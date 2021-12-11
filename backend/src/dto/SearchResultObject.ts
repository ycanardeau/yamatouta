export class SearchResultObject<T> {
	readonly items: T[];
	readonly totalCount: number;

	constructor(items: T[], totalCount: number) {
		this.items = items;
		this.totalCount = totalCount;
	}
}
