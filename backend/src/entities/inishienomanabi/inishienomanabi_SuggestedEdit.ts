import {
	Embedded,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { User } from '../User';
import { inishienomanabi_TranslatedString } from './inishienomanabi_TranslatedString';
import { inishienomanabi_Translation } from './inishienomanabi_Translation';

@Entity({ tableName: 'inishienomanabi_suggested_edits' })
export class inishienomanabi_SuggestedEdit {
	@PrimaryKey()
	id!: number;

	@Property()
	action!: string;

	@Property()
	status!: string;

	@ManyToOne()
	translation!: inishienomanabi_Translation;

	@Embedded({ prefix: false })
	translatedString = new inishienomanabi_TranslatedString();

	@Property()
	category?: string;

	@Property()
	tags?: string;

	@ManyToOne()
	user!: User;

	@Property()
	creationDate = new Date();

	@Property()
	voteCount = 0;
}
