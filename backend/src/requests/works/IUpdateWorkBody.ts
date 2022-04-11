import Joi, { ObjectSchema } from 'joi';

import { WorkType } from '../../models/WorkType';

export interface IUpdateWorkBody {
	name: string;
	workType: WorkType;
}

export const updateWorkBodySchema: ObjectSchema<IUpdateWorkBody> = Joi.object({
	name: Joi.string().required().trim().max(200),
	workType: Joi.string()
		.required()
		.trim()
		.valid(...Object.values(WorkType)),
});
