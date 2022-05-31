import { WebLink } from '../../entities/WebLink';
import { WebLinkCategory } from '../WebLinkCategory';

export class WebLinkSnapshot {
	private constructor(
		readonly url: string,
		readonly title: string,
		readonly category: WebLinkCategory,
	) {}

	static create(webLink: WebLink): WebLinkSnapshot {
		return new WebLinkSnapshot(
			webLink.url,
			webLink.title,
			webLink.category,
		);
	}
}
