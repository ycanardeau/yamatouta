// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Stores/ServerSidePagingStore.ts
import { action, computed, makeObservable, observable } from 'mobx';

export interface IPaginationParams {
	offset: number;
	limit: number;
	getTotalCount: boolean;
}

export class PaginationStore {
	@observable page = 1;
	@observable totalItems = 0;
	@observable pageSize = 10;

	constructor() {
		makeObservable(this);
	}

	@computed get firstItem(): number {
		return (this.page - 1) * this.pageSize;
	}

	@computed get totalPages(): number {
		return Math.ceil(this.totalItems / this.pageSize);
	}

	toParams = (clearResults: boolean): IPaginationParams => {
		return {
			offset: this.firstItem,
			limit: this.pageSize,
			getTotalCount: clearResults || this.totalItems === 0,
		};
	};

	@action setPage = (value: number): void => {
		this.page = value;
	};

	@action goToFirstPage = (): void => {
		this.page = 1;
	};
}
