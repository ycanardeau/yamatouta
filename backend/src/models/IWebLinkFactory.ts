import { WebAddress } from '../entities/WebAddress';
import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from './WebLinkCategory';

export interface IWebLinkFactory<TWebLink extends WebLink> {
	createWebLink(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	): TWebLink;
}
