import { WebLinkCategory } from '../models/WebLinkCategory';

export interface IWebLinkUpdateParams {
	id: number;
	url: string;
	title: string;
	category: WebLinkCategory;
}
