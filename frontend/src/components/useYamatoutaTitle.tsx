import { useTitle } from 'react-use';

import usePageTracking from './usePageTracking';

const useYamatoutaTitle = (title: string | undefined, ready: boolean): void => {
	useTitle(title || 'やまとうた');

	usePageTracking(ready);
};

export default useYamatoutaTitle;
