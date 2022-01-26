import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../components/layout/Layout';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';

const HomeIndex = (): React.ReactElement => {
	const { t } = useTranslation();

	useYamatoutaTitle(undefined, true);

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('shared.home'),
					to: '/',
					isCurrentItem: true,
				},
			]}
		/>
	);
};

export default HomeIndex;
