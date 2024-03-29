import { EntryType } from '@/models/EntryType';
import Joi from 'joi';

export class LinkListTypesParams {
	static readonly schema = Joi.object<LinkListTypesParams>({
		entryType: Joi.string()
			.optional()
			.valid(...Object.values(EntryType)),
		relatedEntryType: Joi.string()
			.optional()
			.valid(...Object.values(EntryType)),
	});

	constructor(
		readonly entryType: EntryType,
		readonly relatedEntryType: EntryType,
	) {}
}
