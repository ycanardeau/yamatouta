import Joi from 'joi';

import { PartialDateUpdateParams } from './PartialDateUpdateParams';

export class ArtistLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly linkTypeId: number,
		readonly relatedArtistId: number,
		readonly beginDate: PartialDateUpdateParams,
		readonly endDate: PartialDateUpdateParams,
		readonly ended: boolean,
	) {}

	static readonly schema = Joi.object<ArtistLinkUpdateParams>({
		id: Joi.number().required(),
		linkTypeId: Joi.number().required(),
		relatedArtistId: Joi.number().required(),
		beginDate: PartialDateUpdateParams.schema,
		endDate: PartialDateUpdateParams.schema,
		ended: Joi.boolean().required(),
	});
}
