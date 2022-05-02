import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './User';

@Entity({ tableName: 'web_address_hosts' })
export class WebAddressHost {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	hostname: string;

	@Property()
	referenceCount = 0;

	@ManyToOne()
	actor: User;

	constructor(hostname: string, actor: User) {
		this.hostname = hostname;
		this.actor = actor;
	}
}
