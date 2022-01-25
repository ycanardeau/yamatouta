import React from 'react';

import { PermissionContext } from './PermissionContext';
import { IAuthenticatedUserObject } from './dto/users/IAuthenticatedUserObject';

export interface IAuthContext {
	isAuthenticated: boolean;
	user?: IAuthenticatedUserObject;
	setUser: (user?: IAuthenticatedUserObject) => void;
	loading: boolean;
	permissionContext: PermissionContext;
}

export const AuthContext = React.createContext<IAuthContext>({
	isAuthenticated: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setUser: () => {},
	loading: true,
	permissionContext: new PermissionContext(),
});
