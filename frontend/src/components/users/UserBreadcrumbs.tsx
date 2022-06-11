import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IUserObject } from '../../dto/IUserObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';

interface UserBreadcrumbsProps {
	user?: Pick<IUserObject, 'id' | 'entryType' | 'name'>;
}

export const UserBreadcrumbs = ({
	user,
}: UserBreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs = ([] as EuiBreadcrumb[])
		.concat({
			text: t('shared.users'),
			href: '/users',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/users');
			},
		})
		.concat(
			user
				? {
						text: user.name,
						href: EntryUrlMapper.details(user),
						onClick: (e): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(user));
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};
