import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { User } from './User';
import { WebAddressHost } from './WebAddressHost';

@Entity({ tableName: 'web_addresses' })
export class WebAddress {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property({ columnType: 'text' /* TODO: , unique: true */ })
	url: string;

	@Property()
	scheme: string;

	@ManyToOne()
	host: IdentifiedReference<WebAddressHost>;

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
	actor: IdentifiedReference<User>;

	constructor(url: URL, host: WebAddressHost, actor: User) {
		this.url = url.href;
		this.scheme = url.protocol.split(':')[0];
		this.host = Reference.create(host);
		this.port = url.port;
		this.path = url.pathname;
		this.query = url.search;
		this.fragment = url.hash;
		this.actor = Reference.create(actor);
	}

	incrementReferenceCount(): void {
		this.host.getEntity().referenceCount++;
		this.referenceCount++;
	}

	decrementReferenceCount(): void {
		this.host.getEntity().referenceCount--;
		this.referenceCount--;
	}
}
