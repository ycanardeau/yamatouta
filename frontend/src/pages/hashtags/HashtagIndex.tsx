import React from 'react';
import { useTranslation } from 'react-i18next';

import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';

const HashtagIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('shared.hashtags'), ready);

	return <></>;
};

export default HashtagIndex;
