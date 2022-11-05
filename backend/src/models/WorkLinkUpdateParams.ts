import { LinkType } from '@/models/LinkType';
import { PartialDateUpdateParams } from '@/models/PartialDateUpdateParams';
import Joi from 'joi';

export class WorkLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly relatedWorkId: number,
		readonly linkType: LinkType,
		readonly beginDate: PartialDateUpdateParams,
		readonly endDate: PartialDateUpdateParams,
		readonly ended: boolean,
	) {}

	static readonly schema = Joi.object<WorkLinkUpdateParams>({
		id: Joi.number().required(),
		relatedWorkId: Joi.number().required(),
		linkType: Joi.string()
			.required()
			.valid(...Object.values(LinkType)),
		beginDate: PartialDateUpdateParams.schema,
		endDate: PartialDateUpdateParams.schema,
		ended: Joi.boolean().required(),
	});
}
