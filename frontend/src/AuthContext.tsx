import React from 'react';

import { PermissionContext } from './PermissionContext';
import { IAuthenticatedUserObject } from './dto/IAuthenticatedUserObject';

export interface IAuthContext {
	isAuthenticated: boolean;
	user?: IAuthenticatedUserObject;
	setUser: (user?: IAuthenticatedUserObject) => void;
	loading: boolean;
	permissionContext: PermissionContext;
}

export const AuthContext = React.createContext<IAuthContext>({
	isAuthenticated: false,
	setUser: () => {},
	loading: true,
	permissionContext: new PermissionContext(),
});
