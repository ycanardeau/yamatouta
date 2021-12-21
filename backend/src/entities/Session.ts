import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'sessions' })
export class Session {
	// TODO: Index using btree.
	@PrimaryKey()
	sid!: string;

	@Property()
	sess: any;

	// TODO: Index using btree.
	@Property()
	expired!: Date;
}
