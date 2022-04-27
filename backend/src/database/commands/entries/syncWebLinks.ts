import { WebLinkObject } from '../../../dto/WebLinkObject';
import { Url } from '../../../entities/Url';
import { WebLink } from '../../../entities/WebLink';
import { IEntryWithWebLinks } from '../../../models/IEntryWithWebLinks';
import { IWebLinkFactory } from '../../../models/IWebLinkFactory';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { collectionSyncWithContent } from '../../../utils/collectionDiff';

export const syncWebLinks = async <TWebLink extends WebLink>(
	entry: IEntryWithWebLinks<TWebLink> & IWebLinkFactory<TWebLink>,
	newItems: WebLinkObject[],
	getOrCreateUrlFunc: (url: string) => Promise<Url>,
	removeFunc: (oldItem: TWebLink) => Promise<void>,
	permissionContext: PermissionContext,
): Promise<void> => {
	await collectionSyncWithContent(
		entry.webLinks.getItems(),
		newItems.filter((webLink) => !!webLink.url.trim()),
		(oldItem, newItem) => oldItem.id === newItem.id,
		async (newItem) => {
			permissionContext.verifyPermission(Permission.CreateWebLinks);

			const url = await getOrCreateUrlFunc(newItem.url);

			return entry.createWebLink({
				url: url,
				title: newItem.title,
				category: newItem.category,
			});
		},
		async (oldItem, newItem) => {
			if (oldItem.contentEquals(newItem)) return false;

			permissionContext.verifyPermission(Permission.EditWebLinks);

			const url = await getOrCreateUrlFunc(newItem.url);

			oldItem.url = url;
			oldItem.title = newItem.title;
			oldItem.category = newItem.category;

			return true;
		},
		async (oldItem) => {
			permissionContext.verifyPermission(Permission.DeleteWebLinks);

			removeFunc(oldItem);
		},
	);
};
