import { useTitle } from '@/shared/hooks';
import React from 'react';

const NotFound = (): React.ReactElement => {
	useTitle('ページが見つかりません');

	return <h2>ページが見つかりません</h2>;
};

export default NotFound;
