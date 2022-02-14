import axios from 'axios';

import { IAuthenticatedUserObject } from '../dto/users/IAuthenticatedUserObject';

export const register = async ({
	email,
	username,
	password,
}: {
	email: string;
	username: string;
	password: string;
}): Promise<IAuthenticatedUserObject> => {
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

export const login = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<IAuthenticatedUserObject> => {
	const response = await axios.post<IAuthenticatedUserObject>('/auth/login', {
		email,
		password,
	});

	return response.data;
};

export const logout = (): Promise<void> => {
	return axios.post('/auth/logout');
};
