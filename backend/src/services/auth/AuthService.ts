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
		// See https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function/72336399#72336399
		request.logOut((err) => {
			if (err) {
				// TODO: Log.
				return;
			}

			request.session.cookie.maxAge = 0;
		});
	}
}
