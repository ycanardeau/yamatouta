import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getUser } from '../../api/UserApi';
import Layout from '../../components/layout/Layout';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IUserObject } from '../../dto/users/IUserObject';

interface UserDetailsLayoutProps {
	user: IUserObject;
}

const UserDetailsLayout = ({
	user,
}: UserDetailsLayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	useYamatoutaTitle(user.name, true);

	return (
		<Layout
			breadcrumbItems={[
				{ text: t('shared.users'), to: '/users' },
				{
					text: user.name,
					to: `/users/${user.id}`,
					isCurrentItem: true,
				},
			]}
		></Layout>
	);
};

const UserDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ user: IUserObject } | undefined
	>();

	const { userId } = useParams();

	React.useEffect(() => {
		getUser(Number(userId)).then((user) =>
			setModel({
				user: user,
			}),
		);
	}, [userId]);

	return model ? <UserDetailsLayout user={model.user} /> : null;
};

export default UserDetails;
