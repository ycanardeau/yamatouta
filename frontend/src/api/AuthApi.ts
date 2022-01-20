import axios from 'axios';

import { IAuthenticatedUserObject } from '../dto/users/IAuthenticatedUserObject';

export const register = async (params: {
	email: string;
	username: string;
	password: string;
}): Promise<IAuthenticatedUserObject> => {
	const { email, username, password } = params;

	const response = await axios.post<IAuthenticatedUserObject>(
		'/auth/register',
		{
			email,
			username,
			password,
		},
	);

	return response.data;
};

export const login = async (params: {
	email: string;
	password: string;
}): Promise<IAuthenticatedUserObject> => {
	const { email, password } = params;

	const response = await axios.post<IAuthenticatedUserObject>('/auth/login', {
		email,
		password,
	});

	return response.data;
};

export const logout = (): Promise<void> => {
	return axios.post('/auth/logout');
};
