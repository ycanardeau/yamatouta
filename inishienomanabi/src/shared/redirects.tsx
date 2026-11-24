import { getRandomWord } from '@/data/database';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// On inishienomanabi.net, searching had already been moved to yamatouta.net.
const yamatoutaUrl = (params: Record<string, string>): string =>
	`https://yamatouta.net/translations?${new URLSearchParams(params)}`;

const useRedirect = (getUrl: () => Promise<string> | string): void => {
	React.useEffect(() => {
		Promise.resolve(getUrl()).then((url) => window.location.replace(url));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

// `/search?q=...`, and `/search?random-select` for a random word.
export const SearchRedirect = (): null => {
	const [searchParams] = useSearchParams();

	useRedirect(async () =>
		yamatoutaUrl({
			query: searchParams.has('random-select')
				? (await getRandomWord()) ?? ''
				: searchParams.get('q') ?? '',
		}),
	);

	return null;
};

export const JapaneseRedirect = (): null => {
	const { query = '' } = useParams();
	useRedirect(() => yamatoutaUrl({ sort: 'HeadwordAsc', query }));
	return null;
};

export const YamatokotobaRedirect = (): null => {
	const { query = '' } = useParams();
	useRedirect(() => yamatoutaUrl({ sort: 'YamatokotobaAsc', query }));
	return null;
};
