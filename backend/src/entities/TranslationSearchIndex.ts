import { Entity, Index, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Translation } from './Translation';

@Entity({ tableName: 'translation_search_index' })
@Index({
	properties: ['headword', 'reading', 'yamatokotoba'],
	type: 'fulltext',
})
export class TranslationSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	translation: Translation;

	@Property({ columnType: 'text', lazy: true })
	headword: string;

	@Property({ columnType: 'text', lazy: true })
	reading: string;

	@Property({ columnType: 'text', lazy: true })
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
