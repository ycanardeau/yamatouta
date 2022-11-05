import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import axios from 'axios';

class AuthApi {
	login = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserDto> => {
		const response = await axios.post<IAuthenticatedUserDto>(
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
