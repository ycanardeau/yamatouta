import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

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
	host: WebAddressHost;

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

	constructor(url: URL, host: WebAddressHost, actor: User) {
		this.url = url.href;
		this.scheme = url.protocol.split(':')[0];
		this.host = host;
		this.port = url.port;
		this.path = url.pathname;
		this.query = url.search;
		this.fragment = url.hash;
		this.actor = actor;
	}

	incrementReferenceCount(): void {
		this.host.referenceCount++;
		this.referenceCount++;
	}

	decrementReferenceCount(): void {
		this.host.referenceCount--;
		this.referenceCount--;
	}
}
