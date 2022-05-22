import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IUserObject } from '../../dto/IUserObject';

interface UserBreadcrumbsProps {
	user?: Pick<IUserObject, 'id' | 'name'>;
}

const UserBreadcrumbs = ({
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
						href: `/users/${user.id}`,
						onClick: (e): void => {
							e.preventDefault();
							navigate(`/users/${user.id}`);
						},
				  }
				: [],
		);

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

export default UserBreadcrumbs;
