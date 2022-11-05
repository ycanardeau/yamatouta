import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import Joi from 'joi';

export class WorkGetParams {
	constructor(readonly id: number, readonly fields?: WorkOptionalField[]) {}

	static readonly schema = Joi.object<WorkGetParams>({
		id: Joi.number().required(),
		fields: Joi.array()
			.optional()
			.items(
				Joi.string()
					.required()
					.trim()
					.valid(...Object.values(WorkOptionalField)),
			),
	});
}
