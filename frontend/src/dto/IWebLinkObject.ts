import { WebLinkCategory } from '@/models/WebLinkCategory';

export interface IWebLinkObject {
	id: number;
	url: string;
	title: string;
	category: WebLinkCategory;
}
