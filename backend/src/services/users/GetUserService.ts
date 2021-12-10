import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';

@Injectable()
export class GetUserService {
	constructor(private readonly em: EntityManager) {}

	async getUser(userId: number): Promise<UserObject> {
		const user = await this.em.findOne(User, {
			id: userId,
			deleted: false,
			hidden: false,
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user);
	}
}