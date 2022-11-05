import { WebLink } from '@/entities/WebLink';
import { IWebLink } from '@/models/IWebLink';
import { WebLinkCategory } from '@/models/WebLinkCategory';

export class WebLinkObject implements IWebLink {
	private constructor(
		readonly id: number,
		readonly url: string,
		readonly title: string,
		readonly category: WebLinkCategory,
	) {}

	static create(webLink: WebLink): WebLinkObject {
		return new WebLinkObject(
			webLink.id,
			webLink.url,
			webLink.title,
			webLink.category,
		);
	}
}
