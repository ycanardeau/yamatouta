import React from 'react';

import { IAuthenticatedUserObject } from './dto/users/IAuthenticatedUserObject';

export interface IAuthContext {
	isAuthenticated: boolean;
	user?: IAuthenticatedUserObject;
	loading: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
	isAuthenticated: false,
	loading: true,
});
