import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { IAuthApiClientProvider } from '@/providers.abstractions/IAuthApiClientProvider';
import axios from 'axios';

export class AuthApiClientProvider implements IAuthApiClientProvider {
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
