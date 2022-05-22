import React from 'react';

import { AuthContext } from './AuthContext';
import { PermissionContext } from './PermissionContext';
import { userApi } from './api/userApi';
import { IAuthenticatedUserObject } from './dto/IAuthenticatedUserObject';

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
		(async (): Promise<void> => {
			try {
				if (localStorage.getItem('isAuthenticated') === 'true') {
					const user = await userApi.getCurrent();

					setUser(user);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				user: user,
				setUser: setUser,
				loading: loading,
				permissionContext: new PermissionContext(user),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
