import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/User';
import { WebAddress } from '../entities/WebAddress';
import { WebAddressHost } from '../entities/WebAddressHost';

@Injectable()
export class WebAddressFactory {
	private async getOrCreateWebAddressHost(
		em: EntityManager,
		url: URL,
		actor: User,
	): Promise<WebAddressHost> {
		const host =
			(await em.findOne(WebAddressHost, { hostname: url.hostname })) ??
			new WebAddressHost(url.hostname, actor);

		em.persist(host);

		return host;
	}

	async getOrCreateWebAddress(
		em: EntityManager,
		url: URL,
		actor: User,
	): Promise<WebAddress> {
		const host = await this.getOrCreateWebAddressHost(em, url, actor);

		const address =
			(await em.findOne(WebAddress, { url: url.href })) ??
			new WebAddress(url, host, actor);

		em.persist(address);

		return address;
	}
}
