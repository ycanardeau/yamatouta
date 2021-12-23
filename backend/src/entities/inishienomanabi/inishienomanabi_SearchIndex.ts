import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { inishienomanabi_Translation } from './inishienomanabi_Translation';

@Entity({ tableName: 'inishienomanabi_search_index' })
export class inishienomanabi_SearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	translation!: inishienomanabi_Translation;

	@Property({ columnType: 'text' })
	japanese!: string;

	@Property({ columnType: 'text' })
	reading!: string;

	@Property({ columnType: 'text' })
	yamatokotoba!: string;

	@Property()
	category!: string;

	@Property({ columnType: 'text' })
	tags!: string;
}
