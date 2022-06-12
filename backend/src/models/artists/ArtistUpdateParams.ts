import Joi from 'joi';

import { HashtagUpdateParams } from '../HashtagUpdateParams';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { ArtistType } from './ArtistType';

export class ArtistUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly hashtags: HashtagUpdateParams[],
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<ArtistUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
		hashtags: Joi.array().items(HashtagUpdateParams.schema).required(),
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
	});
}
