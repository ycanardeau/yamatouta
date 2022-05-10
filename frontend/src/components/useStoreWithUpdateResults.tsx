// See also: https://github.com/VocaDB/vocadb/pull/965
import _, { PartialObject } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';

import {
	IStoreWithRouteParams,
	useStoreWithRouteParams,
} from './useStoreWithRouteParams';

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Stores/IStoreWithUpdateResults.ts
export interface IStoreWithUpdateResults<TRouteParams>
	extends IStoreWithRouteParams<TRouteParams> {
	clearResultsByQueryKeys: string[];

	updateResults: (clearResults: boolean) => Promise<void>;
}

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Components/useStoreWithUpdateResults.ts
// Updates search results whenever the `routeParams` property changes.
export const useStoreWithUpdateResults = <
	TRouteParams extends PartialObject<TRouteParams>,
>(
	store: IStoreWithUpdateResults<TRouteParams>,
	// Called when search results should be cleared.
	onClearResults?: (popState: boolean) => void,
): void => {
	// This must be called before `useStoreWithRouteParams` because this may change `routeParams` based on `clearResultsByQueryKeys`.
	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams, previousRouteParams) => {
				// Determines if search results should be cleared by comparing the current and previous values.
				// Assuming that the current value is `{ filter: 'Miku', page: 3939, searchType: 'Artist' }`, and the previous one is `{ filter: 'Miku', page: 1 }`,
				// then the diff will be `{ page: 3939, searchType: 'Artist' }`, which results in `['page', 'searchType']`.
				const clearResults = _.chain(routeParams)
					.omitBy((v, k) =>
						_.isEqual(
							previousRouteParams[
								k as keyof typeof previousRouteParams
							],
							v,
						),
					)
					.keys()
					.some((k) => store.clearResultsByQueryKeys.includes(k))
					.value();

				if (clearResults) onClearResults?.(store.popState);

				store.updateResults(clearResults);
			},
		);
	}, [store, onClearResults]);

	useStoreWithRouteParams(store);

	React.useEffect(() => {
		// This is called when the page is first loaded.
		store.updateResults(true);
	}, [store]);
};
