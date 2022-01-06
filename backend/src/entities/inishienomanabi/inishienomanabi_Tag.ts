import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'inishienomanabi_tags' })
export class inishienomanabi_Tag {
	@PrimaryKey({ length: 64 })
	tagName!: string;

	@Property()
	count = 0;
}
