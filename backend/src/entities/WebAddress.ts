import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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

	constructor(url: URL) {
		this.url = url.href;
		this.scheme = url.protocol.split(':')[0];
		this.host = url.hostname;
		this.port = url.port;
		this.path = url.pathname;
		this.query = url.search;
		this.fragment = url.hash;
	}
}
