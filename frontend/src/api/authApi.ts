import axios from 'axios';

import { IAuthenticatedUserObject } from '../dto/IAuthenticatedUserObject';

class AuthApi {
	login = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserObject> => {
		const response = await axios.post<IAuthenticatedUserObject>(
			'/auth/login',
			{
				email,
				password,
			},
		);

		return response.data;
	};

	logout = async (): Promise<void> => {
		return axios.post('/auth/logout');
	};
}

export const authApi = new AuthApi();
