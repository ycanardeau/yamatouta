import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { UserObject } from '../../dto/users/UserObject';
import { AuthenticateUserService } from '../users/AuthenticateUserService';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authenticateUserService: AuthenticateUserService,
	) {
		super({ usernameField: 'email', passReqToCallback: true });
	}

	validate(
		request: Request,
		email: string,
		password: string,
	): Promise<UserObject> {
		return this.authenticateUserService.authenticateUser({
			email: email,
			password: password,
			ip: request.ip,
		});
	}
}
