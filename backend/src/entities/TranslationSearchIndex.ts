import { Entity, Index, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Translation } from './Translation';

@Entity({ tableName: 'translation_search_index' })
export class TranslationSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	translation!: Translation;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	headword!: string;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	reading!: string;

	@Property({ columnType: 'text', lazy: true })
	@Index({ type: 'fulltext' })
	yamatokotoba!: string;
}
