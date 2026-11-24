import { pageTitle } from '@/shared/constants';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Returns undefined until the promise resolves.
export const useAsync = <T>(
	load: () => Promise<T>,
	deps: React.DependencyList,
): T | undefined => {
	const [value, setValue] = React.useState<T>();

	React.useEffect(() => {
		let active = true;
		setValue(undefined);
		load().then((result) => {
			if (active) setValue(result);
		});
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return value;
};

export const useTitle = (title?: string): void => {
	React.useEffect(() => {
		document.title = pageTitle(title);
	}, [title]);
};

// Same rules as getPageNumberParameter and getPageSizeParameter.
export const usePagination = (): { page: number; pageSize: number } => {
	const [searchParams] = useSearchParams();
	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const pageSize = Math.min(
		200,
		Math.max(1, Number(searchParams.get('pagesize')) || 50),
	);
	return { page, pageSize };
};
