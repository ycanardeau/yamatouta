import Joi from 'joi';

import { ArtistLinkUpdateParams } from '../ArtistLinkUpdateParams';
import { HashtagLinkUpdateParams } from '../HashtagLinkUpdateParams';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { WorkType } from './WorkType';

export class WorkUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly workType: WorkType,
		readonly hashtagLinks: HashtagLinkUpdateParams[],
		readonly webLinks: WebLinkUpdateParams[],
		readonly artistLinks: ArtistLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<WorkUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		workType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WorkType)),
		hashtagLinks: Joi.array()
			.required()
			.items(HashtagLinkUpdateParams.schema),
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
		artistLinks: Joi.array()
			.required()
			.items(ArtistLinkUpdateParams.schema),
	});
}
