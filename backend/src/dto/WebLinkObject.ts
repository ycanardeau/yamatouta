import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from '../models/WebLinkCategory';

export class WebLinkObject {
	readonly url: string;
	readonly category: WebLinkCategory;

	constructor(webLink: WebLink) {
		this.url = webLink.url.url;
		this.category = webLink.category;
	}
}
