import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UserObject } from '../../dto/users/UserObject';
import { GetUserService } from '../users/GetUserService';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(private readonly getUserService: GetUserService) {
		super();
	}

	serializeUser(user: UserObject, done: CallableFunction): void {
		done(null, user.id);
	}

	async deserializeUser(payload: any, done: CallableFunction): Promise<void> {
		const user = await this.getUserService.getUser(Number(payload));
		done(null, user);
	}
}
