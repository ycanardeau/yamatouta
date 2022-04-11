import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { HistoryRegular, InfoRegular } from '@fluentui/react-icons';
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
	work: IWorkObject;
}

const Layout = ({ work }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

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
					</Routes>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

const WorkDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ work: IWorkObject } | undefined
	>();

	const { workId } = useParams();

	React.useEffect(() => {
		getWork({ workId: Number(workId) }).then((work) =>
			setModel({
				work: work,
			}),
		);
	}, [workId]);

	return model ? <Layout work={model.work} /> : null;
};

export default WorkDetails;
