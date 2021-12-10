import React from 'react';
import { useTranslation } from 'react-i18next';

import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IUserObject } from '../../dto/users/IUserObject';
import Layout from '../Layout';

interface IUserBasicInfoProps {
	user: IUserObject;
}

const UserBasicInfo = ({ user }: IUserBasicInfoProps): React.ReactElement => {
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

export default UserBasicInfo;