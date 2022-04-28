import { WebLinkObject } from '../../../dto/WebLinkObject';
import { WebAddress } from '../../../entities/WebAddress';
import { WebLink } from '../../../entities/WebLink';
import { IEntryWithWebLinks } from '../../../models/IEntryWithWebLinks';
import { IWebLinkFactory } from '../../../models/IWebLinkFactory';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { collectionSyncWithContent } from '../../../utils/collectionDiff';

export const syncWebLinks = async <TWebLink extends WebLink>(
	entry: IEntryWithWebLinks<TWebLink> & IWebLinkFactory<TWebLink>,
	newItems: WebLinkObject[],
	getOrCreateWebAddressFunc: (url: URL) => Promise<WebAddress>,
	removeFunc: (oldItem: TWebLink) => Promise<void>,
	permissionContext: PermissionContext,
): Promise<void> => {
	const create = async (newItem: WebLinkObject): Promise<TWebLink> => {
		permissionContext.verifyPermission(Permission.CreateWebLinks);

		const address = await getOrCreateWebAddressFunc(new URL(newItem.url));

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

		const address = await getOrCreateWebAddressFunc(new URL(newItem.url));

		oldItem.address = address;
		oldItem.title = newItem.title;
		oldItem.category = newItem.category;

		return true;
	};

	const remove = async (oldItem: TWebLink): Promise<void> => {
		permissionContext.verifyPermission(Permission.DeleteWebLinks);

		removeFunc(oldItem);
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
