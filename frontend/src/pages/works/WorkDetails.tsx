import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import WorkPage from '../../components/works/WorkPage';
import { useWorkDetails } from '../../components/works/useWorkDetails';
import { IWorkObject } from '../../dto/IWorkObject';
import { WorkDetailsObject } from '../../dto/WorkDetailsObject';
import { Permission } from '../../models/Permission';
import { WorkDetailsStore } from '../../stores/works/WorkDetailsStore';
import WorkBasicInfo from './WorkBasicInfo';

interface LayoutProps {
	store: WorkDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const work = store.work;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const title = work.name;

	useYamatoutaTitle(title, true);

	return (
		<WorkPage
			work={work}
			pageHeaderProps={{
				pageTitle: title,
				rightSideItems: [
					<EuiButton
						size="s"
						href={`/works/${work.id}/edit`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}/edit`);
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Work_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={`/works/${work.id}/revisions`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}/revisions`);
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: `/works/${work.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: tab === undefined,
						label: t('shared.basicInfo'),
					},
				],
			}}
		>
			<Routes>
				<Route path="" element={<WorkBasicInfo work={work} />} />
			</Routes>
		</WorkPage>
	);
});

const WorkDetails = (): React.ReactElement | null => {
	const [store] = useWorkDetails(
		React.useCallback(
			(work) =>
				new WorkDetailsStore(
					WorkDetailsObject.create(work as Required<IWorkObject>),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default WorkDetails;
