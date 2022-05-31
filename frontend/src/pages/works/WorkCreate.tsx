import React from 'react';
import { useTranslation } from 'react-i18next';

import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { WorkEditForm } from '../../components/works/WorkEditForm';
import { WorkPage } from '../../components/works/WorkPage';

const WorkCreate = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const title = t('works.addWork');

	useYamatoutaTitle(title, ready);

	return (
		<WorkPage pageHeaderProps={{ pageTitle: title }}>
			<WorkEditForm />
		</WorkPage>
	);
};

export default WorkCreate;
