import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';

// Schema from: https://github.com/metabrainz/musicbrainz-server/blob/6024ab554fecbb1156e1bd06c523305512f1da69/lib/MusicBrainz/Server/Data/LinkType.pm.
@Entity({ tableName: 'link_types' })
export class LinkType {
	@PrimaryKey()
	id!: number;

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Enum()
	entryType: EntryType;

	@Enum()
	relatedEntryType: EntryType;

	@Property()
	name: string;

	constructor({
		entryType,
		relatedEntryType,
		name,
	}: {
		entryType: EntryType;
		relatedEntryType: EntryType;
		name: string;
	}) {
		this.entryType = entryType;
		this.relatedEntryType = relatedEntryType;
		this.name = name;
	}
}
