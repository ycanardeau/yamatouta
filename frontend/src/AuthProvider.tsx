import React from 'react';

import { AuthContext } from './AuthContext';
import { getAuthenticatedUser } from './api/UserApi';
import { IAuthenticatedUserObject } from './dto/users/IAuthenticatedUserObject';

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({
	children,
}: AuthProviderProps): React.ReactElement => {
	const [user, setUser] = React.useState<
		IAuthenticatedUserObject | undefined
	>();
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		getAuthenticatedUser()
			.then((user) => {
				setUser(user);
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) return;

				throw error;
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				user: user,
				setUser: setUser,
				loading: loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
