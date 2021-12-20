import axios from 'axios';

import config from '../config';
import { IUserObject } from '../dto/users/IUserObject';

export const register = async (params: {
	email: string;
	username: string;
	password: string;
}): Promise<IUserObject> => {
	const { email, username, password } = params;

	const response = await axios.post<IUserObject>(
		`${config.apiEndpoint}/auth/register`,
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
}): Promise<IUserObject> => {
	const { email, password } = params;

	const response = await axios.post<IUserObject>(
		`${config.apiEndpoint}/auth/login`,
		{ email, password },
	);

	return response.data;
};
