import Joi from 'joi';

import { PartialDateUpdateParams } from './PartialDateUpdateParams';

export class WorkLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly linkTypeId: number,
		readonly relatedWorkId: number,
		readonly beginDate: PartialDateUpdateParams,
		readonly endDate: PartialDateUpdateParams,
		readonly ended: boolean,
	) {}

	static readonly schema = Joi.object<WorkLinkUpdateParams>({
		id: Joi.number().required(),
		linkTypeId: Joi.number().required(),
		relatedWorkId: Joi.number().required(),
		beginDate: PartialDateUpdateParams.schema,
		endDate: PartialDateUpdateParams.schema,
		ended: Joi.boolean().required(),
	});
}
