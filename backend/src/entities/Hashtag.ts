import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { User } from './User';

@Entity({ tableName: 'hashtags' })
export abstract class Hashtag {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Property({ length: 100, unique: true })
	name!: string;

	@ManyToOne()
	actor: IdentifiedReference<User>;

	constructor(actor: User) {
		this.actor = Reference.create(actor);
	}
}
