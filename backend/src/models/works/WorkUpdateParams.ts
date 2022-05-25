import Joi from 'joi';

import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { WorkType } from './WorkType';

export class WorkUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<WorkUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		workType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WorkType)),
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
	});
}
