import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedUserObject } from '../../dto/AuthenticatedUserObject';
import { getUser } from '../../utils/getUser';

@Injectable()
export class AuthService {
	async login(
		request: Request,
	): Promise<AuthenticatedUserObject | undefined> {
		return getUser(request);
	}

	logout(request: Request): void {
		request.logOut();
		request.session.cookie.maxAge = 0;
	}
}
