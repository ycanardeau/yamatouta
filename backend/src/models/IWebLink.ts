import { WebLinkCategory } from '@/models/WebLinkCategory';

export interface IWebLink {
	url: string;
	title: string;
	category: WebLinkCategory;
}
