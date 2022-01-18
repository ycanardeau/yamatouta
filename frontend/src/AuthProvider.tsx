import React from 'react';

import { AuthContext } from './AuthContext';
import { IAuthenticatedUserObject } from './dto/users/IAuthenticatedUserObject';

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({
	children,
}: AuthProviderProps): React.ReactElement => {
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	const [user, setUser] = React.useState<
		IAuthenticatedUserObject | undefined
	>();
	const [loading, setLoading] = React.useState(true);

	return (
		<AuthContext.Provider
			value={{ isAuthenticated: isAuthenticated, loading: loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
