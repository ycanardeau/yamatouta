import {
	Collection,
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { IEntryWithDeletedAndHidden } from '../models/IEntryWithDeletedAndHidden';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { IWorkLinkFactory } from '../models/IWorkLinkFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { TranslationSnapshot } from '../models/snapshots/TranslationSnapshot';
import { WordCategory } from '../models/translations/WordCategory';
import { NgramConverter } from '../services/NgramConverter';
import { Commit } from './Commit';
import { Link } from './Link';
import { TranslationRevision } from './Revision';
import { TranslatedString } from './TranslatedString';
import { TranslationSearchIndex } from './TranslationSearchIndex';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { TranslationWebLink } from './WebLink';
import { Work } from './Work';
import { TranslationWorkLink } from './WorkLink';

@Entity({ tableName: 'translations' })
export class Translation
	implements
		IEntryWithDeletedAndHidden,
		IEntryWithRevisions<
			Translation,
			TranslationRevision,
			TranslationSnapshot
		>,
		IRevisionFactory<Translation, TranslationRevision, TranslationSnapshot>,
		IEntryWithWebLinks<TranslationWebLink>,
		IWebLinkFactory<TranslationWebLink>,
		IEntryWithWorkLinks<TranslationWorkLink>,
		IWorkLinkFactory<TranslationWorkLink>
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
	translatedString = new TranslatedString();

	@Enum()
	category!: WordCategory;

	// For backward compatibility.
	@Property({ type: Array })
	inishienomanabi_tags: string[] = [];

	@ManyToOne()
	user!: User;

	@OneToOne(
		() => TranslationSearchIndex,
		(searchIndex) => searchIndex.translation,
	)
	searchIndex = new TranslationSearchIndex({ translation: this });

	@Property()
	version = 0;

	@OneToMany(() => TranslationRevision, (revision) => revision.translation)
	revisions = new Collection<TranslationRevision>(this);

	get revisionManager(): RevisionManager<
		Translation,
		TranslationRevision,
		TranslationSnapshot
	> {
		return new RevisionManager(this);
	}

	@OneToMany(() => TranslationWebLink, (webLink) => webLink.translation)
	webLinks = new Collection<TranslationWebLink>(this);

	@OneToMany(() => TranslationWorkLink, (workLink) => workLink.translation)
	workLinks = new Collection<TranslationWorkLink>(this);

	constructor(user: User) {
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

	takeSnapshot(): TranslationSnapshot {
		return new TranslationSnapshot(this);
	}

	createRevision({
		commit,
		actor,
		event,
		summary,
	}: {
		commit: Commit;
		actor: User;
		event: RevisionEvent;
		summary: string;
	}): TranslationRevision {
		return new TranslationRevision({
			translation: this,
			commit: commit,
			actor: actor,
			snapshot: this.takeSnapshot(),
			summary: summary,
			event: event,
			version: ++this.version,
		});
	}

	createWebLink({
		address,
		title,
		category,
	}: {
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}): TranslationWebLink {
		return new TranslationWebLink({
			translation: this,
			address: address,
			title: title,
			category: category,
		});
	}

	createWorkLink({
		relatedWork,
		...params
	}: { relatedWork: Work } & Link): TranslationWorkLink {
		return new TranslationWorkLink({
			...params,
			translation: this,
			relatedWork: relatedWork,
		});
	}
}
