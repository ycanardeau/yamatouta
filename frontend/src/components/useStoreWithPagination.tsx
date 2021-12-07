// See also: https://github.com/VocaDB/vocadb/pull/965
import React from 'react';

import { PaginationStore } from '../stores/PaginationStore';
import {
	IStoreWithUpdateResults,
	useStoreWithUpdateResults,
} from './useStoreWithUpdateResults';

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Stores/IStoreWithPaging.ts
export interface IStoreWithPagination<TRouteParams, TResult>
	extends IStoreWithUpdateResults<TRouteParams, TResult> {
	paginationStore: PaginationStore;
}

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Components/useStoreWithPaging.ts
export const useStoreWithPagination = <TRouteParams, TResult>(
	store: IStoreWithPagination<TRouteParams, TResult>,
): void => {
	const handleClearResults = React.useCallback(
		(popState) => {
			// Do not go to the first page when the back/forward buttons are clicked.
			if (!popState) store.paginationStore.goToFirstPage();
		},
		[store],
	);

	useStoreWithUpdateResults(store, handleClearResults);
};
