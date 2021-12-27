import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';

@Injectable()
export class LoginService {
	async login(request: Request): Promise<AuthenticatedUserObject> {
		const { user } = request;

		if (!(user instanceof AuthenticatedUserObject))
			throw new Error('user must be of type AuthenticatedUserObject.');

		return user;
	}
}
