import { PermissionContext } from '@/PermissionContext';
import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import React from 'react';

export interface IAuthContext {
	isAuthenticated: boolean;
	user?: IAuthenticatedUserDto;
	setUser: (user?: IAuthenticatedUserDto) => void;
	loading: boolean;
	permissionContext: PermissionContext;
}

export const AuthContext = React.createContext<IAuthContext>({
	isAuthenticated: false,
	setUser: () => {},
	loading: true,
	permissionContext: new PermissionContext(),
});
