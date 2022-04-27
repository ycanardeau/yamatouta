import { Url } from '../entities/Url';
import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from './WebLinkCategory';

export interface IWebLinkFactory<TWebLink extends WebLink> {
	createWebLink({
		url,
		title,
		category,
	}: {
		url: Url;
		title: string;
		category: WebLinkCategory;
	}): TWebLink;
}
