import { observer } from 'mobx-react-lite';
import React from 'react';

import UserPage from '../../components/users/UserPage';
import { useUserDetails } from '../../components/users/useUserDetails';
import { IUserObject } from '../../dto/IUserObject';
import { UserDetailsObject } from '../../dto/UserDetailsObject';
import { UserDetailsStore } from '../../stores/users/UserDetailsStore';

interface LayoutProps {
	store: UserDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const user = store.user;

	return <UserPage user={user}></UserPage>;
});

const UserDetails = (): React.ReactElement | null => {
	const [store] = useUserDetails(
		React.useCallback(
			(user) =>
				new UserDetailsStore(
					UserDetailsObject.create(user as Required<IUserObject>),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default UserDetails;
