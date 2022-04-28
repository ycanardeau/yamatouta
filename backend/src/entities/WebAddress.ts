import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './User';

@Entity({ tableName: 'web_addresses' })
export class WebAddress {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property({ columnType: 'text', unique: true })
	url: string;

	@Property()
	scheme: string;

	@Property()
	host: string;

	@Property()
	port: string;

	@Property({ columnType: 'text' })
	path: string;

	@Property({ columnType: 'text' })
	query: string;

	@Property({ columnType: 'text' })
	fragment: string;

	@Property()
	referenceCount = 0;

	@ManyToOne()
	actor: User;

	constructor(url: URL, actor: User) {
		this.url = url.href;
		this.scheme = url.protocol.split(':')[0];
		this.host = url.hostname;
		this.port = url.port;
		this.path = url.pathname;
		this.query = url.search;
		this.fragment = url.hash;
		this.actor = actor;
	}
}
