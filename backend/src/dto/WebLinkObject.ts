import { WebLink } from '../entities/WebLink';
import { IWebLink } from '../models/IWebLink';
import { WebLinkCategory } from '../models/WebLinkCategory';

export class WebLinkObject implements IWebLink {
	readonly id: number;
	readonly url: string;
	readonly title: string;
	readonly category: WebLinkCategory;

	constructor(webLink: WebLink) {
		this.id = webLink.id;
		this.url = webLink.url;
		this.title = webLink.title;
		this.category = webLink.category;
	}
}
