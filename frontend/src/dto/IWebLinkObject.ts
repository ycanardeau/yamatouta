import { WebLinkCategory } from '../models/WebLinkCategory';

export interface IWebLinkObject {
	id: number;
	url: string;
	category: WebLinkCategory;
}
