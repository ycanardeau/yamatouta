import { LinkType } from '../entities/LinkType';
import { EntryType } from '../models/EntryType';

export class LinkTypeObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType,
		readonly relatedEntryType: EntryType,
		readonly name: string,
	) {}

	static create(linkType: LinkType): LinkTypeObject {
		return new LinkTypeObject(
			linkType.id,
			linkType.entryType,
			linkType.relatedEntryType,
			linkType.name,
		);
	}
}
