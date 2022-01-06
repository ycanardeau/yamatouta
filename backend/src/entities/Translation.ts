import {
	Embedded,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { TranslatedString } from './TranslatedString';
import { User } from './User';

@Entity({ tableName: 'translations' })
export class Translation {
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

	@Embedded({ prefix: false })
	translatedString: TranslatedString;

	@ManyToOne()
	user: User;

	constructor(params: { translatedString: TranslatedString; user: User }) {
		const { translatedString, user } = params;

		this.translatedString = translatedString;
		this.user = user;
	}
}
