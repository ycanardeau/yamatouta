import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import { getUser } from '../../api/UserApi';
import { IUserObject } from '../../dto/users/IUserObject';

const UserBasicInfo = React.lazy(() => import('./UserBasicInfo'));

interface IUserDetailsLayoutProps {
	user: IUserObject;
}

const UserDetailsLayout = ({
	user,
}: IUserDetailsLayoutProps): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<UserBasicInfo user={user} />} />
		</Routes>
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
