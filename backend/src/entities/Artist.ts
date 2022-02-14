import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { ArtistType } from '../models/ArtistType';
import { AuthorType } from '../models/AuthorType';
import { IAuthor } from '../models/IAuthor';

@Entity({ tableName: 'artists' })
export class Artist implements IAuthor {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Property()
	name: string;

	@Enum(() => ArtistType)
	artistType!: ArtistType;

	constructor({
		name,
		artistType,
	}: {
		name: string;
		artistType: ArtistType;
	}) {
		this.name = name;
		this.artistType = artistType;
	}

	get authorType(): AuthorType {
		return AuthorType.Artist;
	}
}
