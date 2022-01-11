import {
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { WordCategory } from '../models/WordCategory';
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

	@Enum(() => WordCategory)
	category?: WordCategory;

	@ManyToOne()
	user: User;

	constructor(params: {
		translatedString: TranslatedString;
		category?: WordCategory;
		user: User;
	}) {
		const { translatedString, category, user } = params;

		this.translatedString = translatedString;
		this.category = category;
		this.user = user;
	}
}
