import { WebLink } from '@/entities/WebLink';
import { IWebLink } from '@/models/IWebLink';
import { WebLinkCategory } from '@/models/WebLinkCategory';

export class WebLinkDto implements IWebLink {
	_webLinkDtoBrand: any;

	private constructor(
		readonly id: number,
		readonly url: string,
		readonly title: string,
		readonly category: WebLinkCategory,
	) {}

	static create(webLink: WebLink): WebLinkDto {
		return new WebLinkDto(
			webLink.id,
			webLink.url,
			webLink.title,
			webLink.category,
		);
	}
}
