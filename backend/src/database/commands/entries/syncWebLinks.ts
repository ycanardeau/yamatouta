import { EntityManager } from '@mikro-orm/core';

import { WebLinkObject } from '../../../dto/WebLinkObject';
import { User } from '../../../entities/User';
import { WebAddress } from '../../../entities/WebAddress';
import { WebAddressHost } from '../../../entities/WebAddressHost';
import { WebLink } from '../../../entities/WebLink';
import { IEntryWithWebLinks } from '../../../models/IEntryWithWebLinks';
import { IWebLinkFactory } from '../../../models/IWebLinkFactory';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { collectionSyncWithContent } from '../../../utils/collectionDiff';

export const syncWebLinks = async <TWebLink extends WebLink>(
	em: EntityManager,
	entry: IEntryWithWebLinks<TWebLink> & IWebLinkFactory<TWebLink>,
	newItems: WebLinkObject[],
	permissionContext: PermissionContext,
): Promise<void> => {
	const user = await em.findOneOrFail(User, {
		id: permissionContext.user?.id,
		deleted: false,
		hidden: false,
	});

	const getOrCreateWebAddressHost = async (
		url: URL,
	): Promise<WebAddressHost> => {
		const host =
			(await em.findOne(WebAddressHost, { hostname: url.host })) ??
			new WebAddressHost(url.host, user);

		em.persist(host);

		return host;
	};

	const getOrCreateWebAddress = async (url: URL): Promise<WebAddress> => {
		const host = await getOrCreateWebAddressHost(url);

		const address =
			(await em.findOne(WebAddress, { url: url.href })) ??
			new WebAddress(url, host, user);

		em.persist(address);

		return address;
	};

	const create = async (newItem: WebLinkObject): Promise<TWebLink> => {
		permissionContext.verifyPermission(Permission.CreateWebLinks);

		const address = await getOrCreateWebAddress(new URL(newItem.url));

		address.incrementReferenceCount();

		return entry.createWebLink({
			address: address,
			title: newItem.title,
			category: newItem.category,
		});
	};

	const update = async (
		oldItem: TWebLink,
		newItem: WebLinkObject,
	): Promise<boolean> => {
		if (oldItem.contentEquals(newItem)) return false;

		permissionContext.verifyPermission(Permission.EditWebLinks);

		const address = await getOrCreateWebAddress(new URL(newItem.url));

		oldItem.address = address;
		oldItem.title = newItem.title;
		oldItem.category = newItem.category;

		return true;
	};

	const remove = async (oldItem: TWebLink): Promise<void> => {
		permissionContext.verifyPermission(Permission.DeleteWebLinks);

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
};
