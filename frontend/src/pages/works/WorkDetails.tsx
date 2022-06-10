import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
	MusicNote2Regular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { WorkPage } from '../../components/works/WorkPage';
import { useWorkDetails } from '../../components/works/useWorkDetails';
import { IWorkObject } from '../../dto/IWorkObject';
import { WorkDetailsObject } from '../../dto/WorkDetailsObject';
import { Permission } from '../../models/Permission';
import { WorkDetailsStore } from '../../stores/works/WorkDetailsStore';
import WorkBasicInfo from './WorkBasicInfo';
import WorkQuotes from './WorkQuotes';

interface LayoutProps {
	store: WorkDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const work = store.work;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const workName = work.name;

	const title = `${t('shared.work')} "${workName}"`;

	useYamatoutaTitle(title, ready);

	return (
		<WorkPage
			work={work}
			pageHeaderProps={{
				pageTitle: workName,
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
								Permission.UpdateWorks,
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
								Permission.ViewRevisions,
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
					{
						href: `/works/${work.id}/quotes`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}/quotes`);
						},
						prepend: <EuiIcon type={MusicNote2Regular} />,
						isSelected: tab === 'quotes',
						label: t('shared.quotes'),
					},
				],
			}}
		>
			<Routes>
				<Route path="" element={<WorkBasicInfo work={work} />} />
				<Route
					path="quotes"
					element={<WorkQuotes workDetailsStore={store} />}
				/>
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
