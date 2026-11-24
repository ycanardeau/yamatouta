import { useTitle } from '@/shared/hooks';
import { EuiEmptyPrompt } from '@elastic/eui';
import React from 'react';

const NotFound = (): React.ReactElement => {
	useTitle('ページが見つかりません');

	return <EuiEmptyPrompt title={<h2>ページが見つかりません</h2>} />;
};

export default NotFound;
