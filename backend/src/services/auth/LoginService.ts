import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserObject } from '../../dto/users/UserObject';

@Injectable()
export class LoginService {
	async login(request: Request): Promise<UserObject> {
		const { user } = request;

		if (!(user instanceof UserObject))
			throw new Error('user must be of type UserObject.');

		return user;
	}
}
