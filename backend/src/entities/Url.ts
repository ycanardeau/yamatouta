import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'urls' })
export class Url {
	@PrimaryKey()
	id!: number;

	@Property({ columnType: 'text', unique: true })
	url: string;

	@Property()
	protocol: string;

	@Property()
	hostname: string;

	@Property()
	port: string;

	@Property({ columnType: 'text' })
	pathname: string;

	@Property({ columnType: 'text' })
	search: string;

	@Property({ columnType: 'text' })
	hash: string;

	constructor(url: URL) {
		this.url = url.href;
		this.protocol = url.protocol;
		this.hostname = url.hostname;
		this.port = url.port;
		this.pathname = url.pathname;
		this.search = url.search;
		this.hash = url.hash;
	}
}
