import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { getUser } from '../../api/UserApi';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IUserObject } from '../../dto/users/IUserObject';
import { UserDetailsStore } from '../../stores/users/UserDetailsStore';

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

interface LayoutProps {
	store: UserDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const user = store.user;

	useYamatoutaTitle(user.name, true);

	return (
		<>
			<Breadcrumbs user={user} />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={user.name} />
		</>
	);
});

const UserDetails = (): React.ReactElement | null => {
	const [store, setStore] = React.useState<UserDetailsStore>();

	const { userId } = useParams();

	React.useEffect(() => {
		getUser({ userId: Number(userId) }).then((user) =>
			setStore(new UserDetailsStore(user)),
		);
	}, [userId]);

	return store ? <Layout store={store} /> : null;
};

export default UserDetails;
