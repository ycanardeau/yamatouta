import {
	Embedded,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { User } from '../User';
import { inishienomanabi_TranslatedString } from './inishienomanabi_TranslatedString';

@Entity({ tableName: 'inishienomanabi_translations' })
export class inishienomanabi_Translation {
	@PrimaryKey()
	id!: number;

	@Property()
	status!: string;

	@Embedded({ prefix: false })
	translatedString = new inishienomanabi_TranslatedString();

	@Property()
	category?: string;

	@Property({ columnType: 'text' })
	tags!: string;

	@Property({ columnType: 'text' })
	description?: string;

	@ManyToOne()
	user?: User;

	@Property()
	ip!: string;

	@Property({ columnType: 'text' })
	source?: string;

	@Property()
	score = 0;

	@Property()
	creationDate = new Date();

	@ManyToOne()
	lastEditorUser?: User;

	@Property()
	lastEditDate!: Date;

	@ManyToOne()
	activationUser?: User;

	@Property()
	activationDate!: Date;

	@Property()
	voteCount = 0;
}
