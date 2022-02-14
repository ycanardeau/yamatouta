import {
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { NgramConverter } from '../helpers/NgramConverter';
import { WordCategory } from '../models/WordCategory';
import { TranslatedString } from './TranslatedString';
import { TranslationSearchIndex } from './TranslationSearchIndex';
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

	constructor({
		translatedString,
		category,
		user,
	}: {
		translatedString: TranslatedString;
		category?: WordCategory;
		user: User;
	}) {
		this.translatedString = translatedString;
		this.category = category;
		this.user = user;
	}

	createSearchIndex(ngramConverter: NgramConverter): TranslationSearchIndex {
		return new TranslationSearchIndex({
			translation: this,
			headword: ngramConverter.toFullText(
				this.translatedString.headword,
				2,
			),
			reading: ngramConverter.toFullText(
				this.translatedString.reading ?? '',
				2,
			),
			yamatokotoba: ngramConverter.toFullText(
				this.translatedString.yamatokotoba,
				2,
			),
		});
	}
}
