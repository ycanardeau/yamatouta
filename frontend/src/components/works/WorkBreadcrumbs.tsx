import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IWorkObject } from '../../dto/IWorkObject';

interface WorkBreadcrumbsProps {
	work?: Pick<IWorkObject, 'id' | 'name'>;
}

const WorkBreadcrumbs = ({
	work,
}: WorkBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.works'),
			href: '/works',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/works');
			},
		})
		.concat(
			work
				? {
						text: work.name,
						href: `/works/${work.id}`,
						onClick: (e): void => {
							e.preventDefault();
							navigate(`/works/${work.id}`);
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

export default WorkBreadcrumbs;
