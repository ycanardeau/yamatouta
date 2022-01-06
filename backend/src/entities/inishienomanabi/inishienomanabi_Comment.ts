import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from '../User';
import { inishienomanabi_Translation } from './inishienomanabi_Translation';

@Entity({ tableName: 'inishienomanabi_comments' })
export class inishienomanabi_Comment {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	translation!: inishienomanabi_Translation;

	@Property({ columnType: 'text' })
	content!: string;

	@ManyToOne()
	user!: User;

	@Property()
	creationDate = new Date();
}
