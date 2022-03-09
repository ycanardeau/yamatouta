import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { getUser } from '../../api/UserApi';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IUserObject } from '../../dto/users/IUserObject';

interface UserDetailsLayoutProps {
	user: IUserObject;
}

interface BreadcrumbsProps {
	user: IUserObject;
}

const Breadcrumbs = ({ user }: BreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.users'),
			href: '/users',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/users');
			},
		},
		{
			text: user.name,
			href: `/users/${user.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/users/${user.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const UserDetailsLayout = ({
	user,
}: UserDetailsLayoutProps): React.ReactElement => {
	useYamatoutaTitle(user.name, true);

	return (
		<>
			<Breadcrumbs user={user} />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={user.name} />
		</>
	);
};

const UserDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ user: IUserObject } | undefined
	>();

	const { userId } = useParams();

	React.useEffect(() => {
		getUser({ userId: Number(userId) }).then((user) =>
			setModel({
				user: user,
			}),
		);
	}, [userId]);

	return model ? <UserDetailsLayout user={model.user} /> : null;
};

export default UserDetails;
