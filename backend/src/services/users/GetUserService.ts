import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';

@Injectable()
export class GetUserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {}

	async getUser(userId: number): Promise<UserObject> {
		const user = await this.userRepo.findOne({
			id: userId,
			deleted: false,
			hidden: false,
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user);
	}
}
