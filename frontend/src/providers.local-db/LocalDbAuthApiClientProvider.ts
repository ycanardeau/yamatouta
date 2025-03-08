import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { IAuthApiClientProvider } from '@/providers.abstractions/IAuthApiClientProvider';

export class LocalDbAuthApiClientProvider implements IAuthApiClientProvider {
	async login({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserDto> {
		throw new Error('Method not implemented.');
	}

	async logout(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
