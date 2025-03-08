import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import axios from 'axios';

class AuthApi {
	async login({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserDto> {
		const response = await axios.post<IAuthenticatedUserDto>(
			'/auth/login',
			{
				email,
				password,
			},
		);

		return response.data;
	}

	async logout(): Promise<void> {
		return axios.post('/auth/logout');
	}
}

export const authApi = new AuthApi();
