import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from '../User';
import { inishienomanabi_SuggestedEdit } from './inishienomanabi_SuggestedEdit';
import { inishienomanabi_Translation } from './inishienomanabi_Translation';

@Entity({ tableName: 'inishienomanabi_reviews' })
export class inishienomanabi_Review {
	@PrimaryKey()
	id!: number;

	@Property()
	action!: string;

	@ManyToOne()
	translation!: inishienomanabi_Translation;

	@ManyToOne()
	suggestedEdit!: inishienomanabi_SuggestedEdit;

	@ManyToOne()
	user!: User;

	@Property({ columnType: 'text' })
	summary!: string;

	@Property()
	creationDate = new Date();
}
