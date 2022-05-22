import {
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import WorkBreadcrumbs from '../../components/works/WorkBreadcrumbs';
import WorkSearchTable from '../../components/works/WorkSearchTable';
import { Permission } from '../../models/Permission';
import { WorkSearchStore } from '../../stores/works/WorkSearchStore';

const WorkIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new WorkSearchStore());

	useYamatoutaTitle(t('shared.works'), ready);

	useStoreWithPagination(store);

	const navigate = useNavigate();

	const auth = useAuth();

	return (
		<>
			<WorkBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.works')}
				rightSideItems={[
					<EuiButton
						size="s"
						href="/works/create"
						onClick={(e): void => {
							e.preventDefault();
							navigate('/works/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Work_Create,
							)
						}
						iconType={AddRegular}
					>
						{t('works.addWork')}
					</EuiButton>,
				]}
			/>

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<WorkSearchTable store={store} />
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default WorkIndex;
