import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { IReferenceCount } from '../models/IReferenceCount';
import { User } from './User';

@Entity({ tableName: 'hashtags' })
export class Hashtag implements IReferenceCount {
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
	name: string;

	@Property()
	referenceCount = 0;

	@ManyToOne()
	actor: IdentifiedReference<User>;

	constructor(name: string, actor: User) {
		this.name = name;
		this.actor = Reference.create(actor);
	}

	incrementReferenceCount(): void {
		this.referenceCount++;
	}

	decrementReferenceCount(): void {
		this.referenceCount--;
	}
}
