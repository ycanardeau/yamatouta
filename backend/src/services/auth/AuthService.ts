import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';

@Injectable()
export class AuthService {
	async login(request: Request): Promise<AuthenticatedUserObject> {
		const { user } = request;

		if (!(user instanceof AuthenticatedUserObject))
			throw new Error('user must be of type AuthenticatedUserObject.');

		return user;
	}

	logout(request: Request): void {
		request.logOut();
		request.session.cookie.maxAge = 0;
	}
}
