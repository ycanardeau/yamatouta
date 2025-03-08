import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';

export interface IAuthApiClientProvider {
	login(request: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserDto>;
	logout(): Promise<void>;
}
