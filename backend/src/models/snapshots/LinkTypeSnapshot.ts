import { LinkType } from '../../entities/LinkType';
import { EntryType } from '../EntryType';

export class LinkTypeSnapshot {
	readonly entryType: EntryType;
	readonly relatedEntryType: EntryType;
	readonly name: string;

	constructor(linkType: LinkType) {
		this.entryType = linkType.entryType;
		this.relatedEntryType = linkType.relatedEntryType;
		this.name = linkType.name;
	}
}
