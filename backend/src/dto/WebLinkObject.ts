import Joi from 'joi';

import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from '../models/WebLinkCategory';

export class WebLinkObject {
	static readonly schema = Joi.object<WebLinkObject>({
		id: Joi.number().required(),
		url: Joi.string().required().trim().allow('').uri(),
		title: Joi.string().required().trim().allow(''),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WebLinkCategory)),
	});

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
