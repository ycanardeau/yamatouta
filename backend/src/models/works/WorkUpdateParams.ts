import { ArtistLinkUpdateParams } from '@/models/ArtistLinkUpdateParams';
import { WebLinkUpdateParams } from '@/models/WebLinkUpdateParams';
import { WorkType } from '@/models/works/WorkType';
import Joi from 'joi';

export class WorkUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly workType: WorkType,
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
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
		artistLinks: Joi.array()
			.required()
			.items(ArtistLinkUpdateParams.schema),
	});
}
