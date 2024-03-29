import { User } from '@/entities/User';
import { WebAddress } from '@/entities/WebAddress';
import { WebAddressHost } from '@/entities/WebAddressHost';
import { WebLink } from '@/entities/WebLink';
import { IEntryWithWebLinks } from '@/models/IEntryWithWebLinks';
import { Permission } from '@/models/Permission';
import { WebLinkUpdateParams } from '@/models/WebLinkUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { collectionSyncWithContent } from '@/utils/collectionDiff';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

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
		entry: IEntryWithWebLinks<TWebLink>,
		newItems: WebLinkUpdateParams[],
		permissionContext: PermissionContext,
		actor: User,
	): Promise<void> {
		const create = async (
			newItem: WebLinkUpdateParams,
		): Promise<TWebLink> => {
			permissionContext.verifyPermission(Permission.CreateWebLinks);

			const address = await this.getOrCreateWebAddress(
				em,
				new URL(newItem.url),
				actor,
			);

			address.incrementReferenceCount();

			return entry.createWebLink(
				address,
				newItem.title,
				newItem.category,
			);
		};

		const update = async (
			oldItem: TWebLink,
			newItem: WebLinkUpdateParams,
		): Promise<boolean> => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.UpdateWebLinks);

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
			permissionContext.verifyPermission(Permission.DeleteWebLinks);

			oldItem.address.getEntity().decrementReferenceCount();

			em.remove(oldItem);
		};

		await collectionSyncWithContent(
			entry.webLinks.getItems(),
			newItems,
			(oldItem, newItem) => oldItem.id === newItem.id,
			create,
			update,
			remove,
		);
	}
}
