import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IWorkObject } from '../../dto/IWorkObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';

interface WorkBreadcrumbsProps {
	work?: Pick<IWorkObject, 'id' | 'entryType' | 'name'>;
}

export const WorkBreadcrumbs = ({
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
						href: EntryUrlMapper.details(work),
						onClick: (e): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(work));
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};
