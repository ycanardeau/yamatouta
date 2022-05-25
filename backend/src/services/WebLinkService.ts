import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { WebLinkUpdateParams } from '../database/commands/WebLinkUpdateParams';
import { User } from '../entities/User';
import { WebAddress } from '../entities/WebAddress';
import { WebAddressHost } from '../entities/WebAddressHost';
import { WebLink } from '../entities/WebLink';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { Permission } from '../models/Permission';
import { collectionSyncWithContent } from '../utils/collectionDiff';
import { PermissionContext } from './PermissionContext';

@Injectable()
export class WebLinkService {
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

	async sync<TWebLink extends WebLink>(
		em: EntityManager,
		entry: IEntryWithWebLinks<TWebLink> & IWebLinkFactory<TWebLink>,
		newItems: WebLinkUpdateParams[],
		permissionContext: PermissionContext,
		actor: User,
	): Promise<void> {
		const create = async (
			newItem: WebLinkUpdateParams,
		): Promise<TWebLink> => {
			permissionContext.verifyPermission(Permission.WebLink_Create);

			const address = await this.getOrCreateWebAddress(
				em,
				new URL(newItem.url),
				actor,
			);

			address.incrementReferenceCount();

			return entry.createWebLink({
				address: address,
				title: newItem.title,
				category: newItem.category,
			});
		};

		const update = async (
			oldItem: TWebLink,
			newItem: WebLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.WebLink_Update);

			const address = await this.getOrCreateWebAddress(
				em,
				new URL(newItem.url),
				actor,
			);

			oldItem.setAddress(address);
			oldItem.title = newItem.title;
			oldItem.category = newItem.category;

			return true;
		};

		const remove = async (oldItem: TWebLink): Promise<void> => {
			permissionContext.verifyPermission(Permission.WebLink_Delete);

			oldItem.address.decrementReferenceCount();

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.webLinks.getItems(),
			newItems.filter((newItem) => !!newItem.url.trim()),
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
