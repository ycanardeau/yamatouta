import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/useAuth';
import { useDialog } from '../../components/useDialog';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import CreateWorkDialog from '../../components/works/CreateWorkDialog';
import WorkSearchTable from '../../components/works/WorkSearchTable';
import { Permission } from '../../models/Permission';
import { WorkSearchStore } from '../../stores/works/WorkSearchStore';

const Breadcrumbs = (): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.works'),
			href: '/works',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/works');
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const WorkIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new WorkSearchStore());

	useYamatoutaTitle(t('shared.works'), ready);

	useStoreWithPagination(store);

	const navigate = useNavigate();

	const auth = useAuth();

	const createWorkDialog = useDialog();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.works')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={createWorkDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateWorks,
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

					{createWorkDialog.visible && (
						<CreateWorkDialog
							onClose={createWorkDialog.close}
							onSuccess={(work): void =>
								navigate(`/works/${work.id}`)
							}
						/>
					)}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default WorkIndex;
