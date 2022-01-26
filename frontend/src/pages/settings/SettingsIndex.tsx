import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../components/layout/Layout';

const SettingsIndex = (): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('users.settings'),
					to: '/settings',
					isCurrentItem: true,
				},
			]}
		></Layout>
	);
};

export default SettingsIndex;
