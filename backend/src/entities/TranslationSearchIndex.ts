import { Entity, Index, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Translation } from './Translation';

@Entity({ tableName: 'translation_search_index' })
export class TranslationSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	translation: Translation;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	headword: string;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	reading: string;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	yamatokotoba: string;

	constructor(params: {
		translation: Translation;
		headword: string;
		reading: string;
		yamatokotoba: string;
	}) {
		const { translation, headword, reading, yamatokotoba } = params;

		this.translation = translation;
		this.headword = headword;
		this.reading = reading;
		this.yamatokotoba = yamatokotoba;
	}
}
