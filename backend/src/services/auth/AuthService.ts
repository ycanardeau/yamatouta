import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { getUser } from '@/utils/getUser';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {
	async login(request: Request): Promise<AuthenticatedUserDto | undefined> {
		return getUser(request);
	}

	logout(request: Request): void {
		request.logOut();
		request.session.cookie.maxAge = 0;
	}
}
