// See also: https://github.com/VocaDB/vocadb/pull/965
import { reaction } from 'mobx';
import qs from 'qs';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Stores/IStoreWithRouteParams.ts
export interface IStoreWithRouteParams<TRouteParams> {
	// Whether currently processing popstate. This is to prevent adding the previous state to history.
	popState: boolean;

	routeParams: TRouteParams;

	validateRouteParams: (data: any) => data is TRouteParams;
}

// Code from: https://github.com/VocaDB/vocadb/blob/7778877a5f0daafdfbd2f92b9387d6897fd5fa9c/VocaDbWeb/Scripts/Components/useStoreWithRouteParams.ts
// Updates a store that implements the `IStoreWithRouteParams` interface when a route changes, and vice versa.
export const useStoreWithRouteParams = <TRouteParams,>(
	store: IStoreWithRouteParams<TRouteParams>,
): void => {
	const location = useLocation();
	const navigate = useNavigate();

	// Pass `location` as deps instead of `location.search`.
	React.useEffect(() => {
		const routeParams: any = qs.parse(location.search.slice(1));

		if (store.validateRouteParams(routeParams)) {
			store.popState = true;

			store.routeParams = routeParams;

			store.popState = false;
		}
	}, [location, store]);

	React.useEffect(() => {
		// Returns the disposer.
		return reaction(
			() => store.routeParams,
			(routeParams) => {
				if (!store.popState) {
					const newUrl = `?${qs.stringify(routeParams)}`;
					navigate(newUrl);
				}
			},
		);
	}, [store, navigate]);
};
