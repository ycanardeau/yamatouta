import { useTitle } from 'react-use';

import { usePageTracking } from './usePageTracking';

export const useYamatoutaTitle = (
	title: string | undefined,
	ready: boolean,
): void => {
	useTitle(title ? `${title} - やまとうた` : 'やまとうた');

	usePageTracking(ready);
};
