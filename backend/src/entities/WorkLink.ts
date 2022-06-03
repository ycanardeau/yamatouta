import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IContentEquatable } from '../models/IContentEquatable';
import { IWorkLink } from '../models/IWorkLink';
import { Link } from './Link';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { Work } from './Work';

@Entity({
	tableName: 'work_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class WorkLink
	extends Link
	implements IWorkLink, IContentEquatable<IWorkLink>
{
	@Property()
	createdAt = new Date();

	@PrimaryKey()
	id!: number;

	@ManyToOne()
	relatedWork: IdentifiedReference<Work>;

	protected constructor({
		relatedWork,
		...params
	}: { relatedWork: Work } & Link) {
		super(params);

		this.relatedWork = Reference.create(relatedWork);
	}

	get relatedWorkId(): number {
		return this.relatedWork.id;
	}

	contentEquals(other: IWorkLink): boolean {
		return (
			this.relatedWorkId === other.relatedWorkId &&
			this.linkType === other.linkType
		);
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Quote })
export class QuoteWorkLink extends WorkLink {
	@ManyToOne()
	quote: IdentifiedReference<Quote>;

	constructor({
		quote,
		relatedWork,
		...params
	}: {
		quote: Quote;
		relatedWork: Work;
	} & Link) {
		super({ ...params, relatedWork });

		this.quote = Reference.create(quote);
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Translation })
export class TranslationWorkLink extends WorkLink {
	@ManyToOne()
	translation: IdentifiedReference<Translation>;

	constructor({
		translation,
		relatedWork,
		...params
	}: {
		translation: Translation;
		relatedWork: Work;
	} & Link) {
		super({ ...params, relatedWork });

		this.translation = Reference.create(translation);
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Work })
export class WorkWorkLink extends WorkLink {
	@ManyToOne()
	work: IdentifiedReference<Work>;

	constructor({
		work,
		relatedWork,
		...params
	}: {
		work: Work;
		relatedWork: Work;
	} & Link) {
		super({ ...params, relatedWork });

		this.work = Reference.create(work);
	}
}
