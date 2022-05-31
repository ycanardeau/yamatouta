import { action, computed, makeObservable, observable } from 'mobx';

export interface IPaginationParams {
	offset: number;
	limit: number;
	getTotalCount: boolean;
}

// Code from: https://github.com/VocaDB/vocadb/blob/961d8bdb631321f3f9b2fd65c94d5b61b779663e/VocaDbWeb/Scripts/ViewModels/ServerSidePagingViewModel.ts.
export class PaginationStore {
	@observable page = 1;
	@observable totalItems = 0;
	@observable pageSize: number;

	constructor({ pageSize = 10 }: { pageSize?: number } = {}) {
		makeObservable(this);

		this.pageSize = pageSize;
	}

	@computed get firstItem(): number {
		return (this.page - 1) * this.pageSize;
	}

	@computed get totalPages(): number {
		return Math.ceil(this.totalItems / this.pageSize);
	}

	@action setPage = (value: number): void => {
		this.page = value;
	};

	goToFirstPage = (): void => this.setPage(1);

	@action setPageSize = (value: number): void => {
		this.pageSize = value;
	};

	toParams = (clearResults: boolean): IPaginationParams => {
		return {
			offset: this.firstItem,
			limit: this.pageSize,
			getTotalCount: clearResults || this.totalItems === 0,
		};
	};
}
