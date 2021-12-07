import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { AuthorType, IAuthor } from './Quote';

export enum ArtistType {
	Person = 'person',
	Group = 'group',
	Other = 'other',
	Character = 'character',
}

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
