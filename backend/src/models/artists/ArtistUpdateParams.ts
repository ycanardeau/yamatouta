import { WebLinkUpdateParams } from '@/models/WebLinkUpdateParams';
import { ArtistType } from '@/models/artists/ArtistType';
import Joi from 'joi';

export class ArtistUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<ArtistUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
	});
}
