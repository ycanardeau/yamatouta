import { EntityManager } from '@mikro-orm/core';

import { WebLinkObject } from '../../../dto/WebLinkObject';
import { User } from '../../../entities/User';
import { WebLink } from '../../../entities/WebLink';
import { IEntryWithWebLinks } from '../../../models/IEntryWithWebLinks';
import { IWebLinkFactory } from '../../../models/IWebLinkFactory';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebAddressFactory } from '../../../services/WebAddressFactory';
import { collectionSyncWithContent } from '../../../utils/collectionDiff';

export const syncWebLinks = async <TWebLink extends WebLink>(
	em: EntityManager,
	entry: IEntryWithWebLinks<TWebLink> & IWebLinkFactory<TWebLink>,
	newItems: WebLinkObject[],
	permissionContext: PermissionContext,
	webAddressFactory: WebAddressFactory,
	actor: User,
): Promise<void> => {
	const create = async (newItem: WebLinkObject): Promise<TWebLink> => {
		permissionContext.verifyPermission(Permission.CreateWebLinks);

		const address = await webAddressFactory.getOrCreateWebAddress(
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
		newItem: WebLinkObject,
	): Promise<boolean> => {
		if (oldItem.contentEquals(newItem)) return false;

		permissionContext.verifyPermission(Permission.EditWebLinks);

		const address = await webAddressFactory.getOrCreateWebAddress(
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
