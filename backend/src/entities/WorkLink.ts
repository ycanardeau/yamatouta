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
import { LinkType } from '../models/LinkType';
import { Link } from './Link';
import { PartialDate } from './PartialDate';
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

	protected constructor(
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(linkType, beginDate, endDate, ended);

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

	constructor(
		quote: Quote,
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(relatedWork, linkType, beginDate, endDate, ended);

		this.quote = Reference.create(quote);
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Translation })
export class TranslationWorkLink extends WorkLink {
	@ManyToOne()
	translation: IdentifiedReference<Translation>;

	constructor(
		translation: Translation,
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(relatedWork, linkType, beginDate, endDate, ended);

		this.translation = Reference.create(translation);
	}
}

@Entity({ tableName: 'work_links', discriminatorValue: EntryType.Work })
export class WorkWorkLink extends WorkLink {
	@ManyToOne()
	work: IdentifiedReference<Work>;

	constructor(
		work: Work,
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(relatedWork, linkType, beginDate, endDate, ended);

		this.work = Reference.create(work);
	}
}
