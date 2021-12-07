import React from 'react';
import { useTranslation } from 'react-i18next';

import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import Layout from '../Layout';

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
