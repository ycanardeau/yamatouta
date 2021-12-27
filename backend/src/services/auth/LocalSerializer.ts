import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { GetUserService } from '../users/GetUserService';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(private readonly getUserService: GetUserService) {
		super();
	}

	serializeUser(user: AuthenticatedUserObject, done: CallableFunction): void {
		done(null, user.id);
	}

	async deserializeUser(payload: any, done: CallableFunction): Promise<void> {
		const user = await this.getUserService.getUser(Number(payload));
		done(null, user);
	}
}
