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
import { Permission } from '../../models/Permission';

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
	const { t } = useTranslation();

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
				<EuiPageContentBody></EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default WorkIndex;
