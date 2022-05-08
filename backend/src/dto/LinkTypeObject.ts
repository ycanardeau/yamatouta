import { LinkType } from '../entities/LinkType';
import { EntryType } from '../models/EntryType';

export class LinkTypeObject {
	readonly id: number;
	readonly entryType: EntryType;
	readonly relatedEntryType: EntryType;
	readonly name: string;

	constructor(linkType: LinkType) {
		this.id = linkType.id;
		this.entryType = linkType.entryType;
		this.relatedEntryType = linkType.relatedEntryType;
		this.name = linkType.name;
	}
}
