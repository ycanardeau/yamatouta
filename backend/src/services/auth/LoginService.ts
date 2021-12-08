import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UserObject } from '../../dto/users/UserObject';

@Injectable()
export class LoginService {
	constructor(
		private readonly configService: ConfigService,
		private readonly em: EntityManager,
	) {}

	async login(request: Request): Promise<UserObject> {
		const { user } = request;

		if (!(user instanceof UserObject))
			throw new Error('user must be of type UserObject.');

		// TODO: Implement.
		throw new Error();
	}
}
