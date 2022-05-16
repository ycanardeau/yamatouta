import { WebLink } from '../../entities/WebLink';
import { WebLinkCategory } from '../WebLinkCategory';

export class WebLinkSnapshot {
	readonly url: string;
	readonly title: string;
	readonly category: WebLinkCategory;

	constructor(webLink: WebLink) {
		this.url = webLink.url;
		this.title = webLink.title;
		this.category = webLink.category;
	}
}
