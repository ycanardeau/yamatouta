import {
	Embeddable,
	Embedded,
	Entity,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

@Embeddable()
export class ParsedUrl {
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

	constructor(url: string) {
		const parsedUrl = new URL(url);

		this.protocol = parsedUrl.protocol;
		this.hostname = parsedUrl.hostname;
		this.port = parsedUrl.port;
		this.pathname = parsedUrl.pathname;
		this.search = parsedUrl.search;
		this.hash = parsedUrl.hash;
	}
}

@Entity({ tableName: 'urls' })
export class Url {
	@PrimaryKey()
	id!: number;

	@Property({ columnType: 'text', unique: true })
	url: string;

	@Embedded()
	parsedUrl: ParsedUrl;

	constructor(url: string) {
		this.url = url;
		this.parsedUrl = new ParsedUrl(url);
	}
}
