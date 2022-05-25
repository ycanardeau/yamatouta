import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from '../models/WebLinkCategory';

export class WebLinkObject {
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
