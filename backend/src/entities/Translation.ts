import {
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	OneToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { NgramConverter } from '../helpers/NgramConverter';
import { ChangeLogEvent } from '../models/ChangeLogEvent';
import { TranslationDiff } from '../models/EntryDiff';
import { IEntryWithChangeLogEntries } from '../models/IEntryWithChangeLogEntries';
import { WordCategory } from '../models/WordCategory';
import { TranslationChangeLogEntry } from './ChangeLogEntry';
import { Revision } from './Revision';
import { TranslatedString } from './TranslatedString';
import { TranslationSearchIndex } from './TranslationSearchIndex';
import { User } from './User';

@Entity({ tableName: 'translations' })
export class Translation
	implements IEntryWithChangeLogEntries<TranslationDiff>
{
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

	@Enum()
	category: WordCategory;

	@ManyToOne()
	user: User;

	@OneToOne(
		() => TranslationSearchIndex,
		(searchIndex) => searchIndex.translation,
	)
	searchIndex = new TranslationSearchIndex({ translation: this });

	constructor({
		translatedString,
		category,
		user,
	}: {
		translatedString: TranslatedString;
		category: WordCategory;
		user: User;
	}) {
		this.translatedString = translatedString;
		this.category = category;
		this.user = user;
	}

	get headword(): string {
		return this.translatedString.headword;
	}
	set headword(value: string) {
		this.translatedString.headword = value;
	}

	get locale(): string {
		return this.translatedString.locale;
	}
	set locale(value: string) {
		this.translatedString.locale = value;
	}

	get reading(): string {
		return this.translatedString.reading;
	}
	set reading(value: string) {
		this.translatedString.reading = value;
	}

	get yamatokotoba(): string {
		return this.translatedString.yamatokotoba;
	}
	set yamatokotoba(value: string) {
		this.translatedString.yamatokotoba = value;
	}

	updateSearchIndex(ngramConverter: NgramConverter): void {
		this.searchIndex.headword = ngramConverter.toFullText(
			this.translatedString.headword,
			2,
		);
		this.searchIndex.reading = ngramConverter.toFullText(
			this.translatedString.reading ?? '',
			2,
		);
		this.searchIndex.yamatokotoba = ngramConverter.toFullText(
			this.translatedString.yamatokotoba,
			2,
		);
	}

	createChangeLogEntry({
		revision,
		actor,
		actionType,
		text,
	}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
	}): TranslationChangeLogEntry {
		return new TranslationChangeLogEntry({
			revision: revision,
			actor: actor,
			actionType: actionType,
			text: text,
			translation: this,
		});
	}
}
