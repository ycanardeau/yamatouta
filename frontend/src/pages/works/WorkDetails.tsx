import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import { getWork } from '../../api/WorkApi';
import { useAuth } from '../../components/useAuth';
import { IWorkObject } from '../../dto/works/IWorkObject';
import { Permission } from '../../models/Permission';
import { WorkOptionalFields } from '../../models/WorkOptionalFields';
import { WorkDetailsStore } from '../../stores/works/WorkDetailsStore';
import WorkEdit from './WorkEdit';
import WorkHistory from './WorkHistory';

interface BreadcrumbsProps {
	work: IWorkObject;
}

const Breadcrumbs = ({ work }: BreadcrumbsProps): React.ReactElement => {
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
		{
			text: work.name,
			href: `/works/${work.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/works/${work.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

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

	return (
		<>
			<Breadcrumbs work={work} />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={work.name}
				tabs={[
					{
						href: `/works/${work.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: !tab,
						label: t('shared.basicInfo'),
					},
					{
						href: `/works/${work.id}/edit`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}/edit`);
						},
						prepend: <EuiIcon type={EditRegular} />,
						isSelected: tab === 'edit',
						disabled: !auth.permissionContext.hasPermission(
							Permission.EditWorks,
						),
						label: t('shared.edit'),
					},
					{
						href: `/works/${work.id}/revisions`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/works/${work.id}/revisions`);
						},
						prepend: <EuiIcon type={HistoryRegular} />,
						isSelected: tab === 'revisions',
						disabled: !auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						),
						label: t('shared.revisions'),
					},
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
					<Routes>
						<Route
							path="quotes"
							element={
								<Navigate to={`/works/${work.id}`} replace />
							}
						/>
						<Route
							path="revisions"
							element={<WorkHistory work={work} />}
						/>
						<Route
							path="edit"
							element={<WorkEdit workDetailsStore={store} />}
						/>
					</Routes>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

const WorkDetails = (): React.ReactElement | null => {
	const [store, setStore] = React.useState<WorkDetailsStore>();

	const { workId } = useParams();

	React.useEffect(() => {
		getWork({
			workId: Number(workId),
			fields: [WorkOptionalFields.WebLinks],
		}).then((work) => setStore(new WorkDetailsStore(work)));
	}, [workId]);

	return store ? <Layout store={store} /> : null;
};

export default WorkDetails;
