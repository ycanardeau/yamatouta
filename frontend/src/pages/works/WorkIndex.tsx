import { useAuth } from '@/components/useAuth';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { WorkPage } from '@/components/works/WorkPage';
import { WorkSearchOptions } from '@/components/works/WorkSearchOptions';
import { WorkSearchTable } from '@/components/works/WorkSearchTable';
import { Permission } from '@/models/Permission';
import { WorkSearchStore } from '@/stores/works/WorkSearchStore';
import { EuiButton, EuiSpacer } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useLocationStateStore } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const WorkIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new WorkSearchStore());

	useYamatoutaTitle(t('shared.works'), ready);

	useLocationStateStore(store);

	const navigate = useNavigate();

	const auth = useAuth();

	return (
		<WorkPage
			pageHeaderProps={{
				pageTitle: t('shared.works'),
				rightSideItems: [
					<EuiButton
						size="s"
						href="/works/create"
						onClick={(e): void => {
							e.preventDefault();
							navigate('/works/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateWorks,
							)
						}
						iconType={AddRegular}
					>
						{t('works.addWork')}
					</EuiButton>,
				],
			}}
		>
			<WorkSearchOptions store={store} />

			<EuiSpacer size="m" />

			<WorkSearchTable store={store} />
		</WorkPage>
	);
};

export default WorkIndex;
