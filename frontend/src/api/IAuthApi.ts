import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';

export interface IAuthApi {
	login(request: {
		email: string;
		password: string;
	}): Promise<IAuthenticatedUserDto>;
	logout(): Promise<void>;
}
