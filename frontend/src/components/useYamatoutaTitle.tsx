import { usePageTracking } from '@/components/usePageTracking';
import { useTitle } from 'react-use';

export const useYamatoutaTitle = (
	title: string | undefined,
	ready: boolean,
): void => {
	useTitle(title ? `${title} - やまとうた` : 'やまとうた');

	usePageTracking(ready);
};
