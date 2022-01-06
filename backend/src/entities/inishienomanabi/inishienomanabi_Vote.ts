import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from '../User';
import { inishienomanabi_Translation } from './inishienomanabi_Translation';

@Entity({ tableName: 'inishienomanabi_votes' })
export class inishienomanabi_Vote {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	translation!: inishienomanabi_Translation;

	@ManyToOne()
	user!: User;

	@Property({ length: 20 })
	action!: string;

	@Property()
	creationDate = new Date();
}
