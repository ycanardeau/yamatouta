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

@Entity({ tableName: 'web_address_hosts' })
export class WebAddressHost implements IReferenceCount {
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
	actor: IdentifiedReference<User>;

	constructor(hostname: string, actor: User) {
		this.hostname = hostname;
		this.actor = Reference.create(actor);
	}

	incrementReferenceCount(): void {
		this.referenceCount++;
	}

	decrementReferenceCount(): void {
		this.referenceCount--;
	}
}
