import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { Link } from './Link';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { Work } from './Work';

@Entity({
	tableName: 'work_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class WorkLink extends Link {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	relatedWork: Work;

	protected constructor({
		relatedWork,
		...params
	}: Link & { relatedWork: Work }) {
		super(params);

		this.relatedWork = relatedWork;
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Quote })
export class QuoteWorkLink extends WorkLink {
	@ManyToOne()
	quote: Quote;

	constructor({
		quote,
		relatedWork,
		...params
	}: Link & {
		quote: Quote;
		relatedWork: Work;
	}) {
		super({ ...params, relatedWork });

		this.quote = quote;
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Translation })
export class TranslationWorkLink extends WorkLink {
	@ManyToOne()
	translation: Translation;

	constructor({
		translation,
		relatedWork,
		...params
	}: Link & {
		translation: Translation;
		relatedWork: Work;
	}) {
		super({ ...params, relatedWork });

		this.translation = translation;
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Work })
export class WorkWorkLink extends WorkLink {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		relatedWork,
		...params
	}: Link & {
		work: Work;
		relatedWork: Work;
	}) {
		super({ ...params, relatedWork });

		this.work = work;
	}
}
