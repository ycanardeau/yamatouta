import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { AuthenticatedUserObject } from '../../dto/AuthenticatedUserObject';
import { User } from '../../entities/User';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {
		super();
	}

	serializeUser(user: AuthenticatedUserObject, done: CallableFunction): void {
		done(null, user.id);
	}

	async deserializeUser(payload: any, done: CallableFunction): Promise<void> {
		const user = await this.userRepo.findOneOrFail({
			id: Number(payload),
			deleted: false,
			hidden: false,
		});

		done(null, AuthenticatedUserObject.create(user));
	}
}
