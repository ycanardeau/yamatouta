import {
	Collection,
	Embedded,
	Entity,
	Enum,
	IdentifiedReference,
	Index,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IEntryWithDeletedAndHidden } from '../models/IEntryWithDeletedAndHidden';
import { IEntryWithHashtagLinks } from '../models/IEntryWithHashtagLinks';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithSearchIndex } from '../models/IEntryWithSearchIndex';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { LinkType } from '../models/LinkType';
import { RevisionEvent } from '../models/RevisionEvent';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { TranslationSnapshot } from '../models/snapshots/TranslationSnapshot';
import { WordCategory } from '../models/translations/WordCategory';
import { NgramConverter } from '../services/NgramConverter';
import { Commit } from './Commit';
import { Hashtag } from './Hashtag';
import { TranslationHashtagLink } from './HashtagLink';
import { PartialDate } from './PartialDate';
import { TranslationRevision } from './Revision';
import { TranslatedString } from './TranslatedString';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { TranslationWebLink } from './WebLink';
import { Work } from './Work';
import { TranslationWorkLink } from './WorkLink';

@Entity({ tableName: 'translations' })
export class Translation
	implements
		IEntryWithDeletedAndHidden,
		IEntryWithSearchIndex<TranslationSearchIndex>,
		IEntryWithRevisions<
			Translation,
			TranslationSnapshot,
			TranslationRevision
		>,
		IEntryWithWebLinks<TranslationWebLink>,
		IEntryWithWorkLinks<EntryType.Translation, TranslationWorkLink>,
		IEntryWithHashtagLinks<TranslationHashtagLink>
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
	actor!: IdentifiedReference<User>;

	@OneToOne(
		() => TranslationSearchIndex,
		(searchIndex) => searchIndex.translation,
	)
	searchIndex: IdentifiedReference<TranslationSearchIndex>;

	@Property()
	version = 0;

	@OneToMany(() => TranslationRevision, (revision) => revision.translation)
	revisions = new Collection<TranslationRevision>(this);

	@OneToMany(() => TranslationWebLink, (webLink) => webLink.translation)
	webLinks = new Collection<TranslationWebLink>(this);

	@OneToMany(() => TranslationWorkLink, (workLink) => workLink.translation)
	workLinks = new Collection<TranslationWorkLink>(this);

	@OneToMany(
		() => TranslationHashtagLink,
		(hashtagLink) => hashtagLink.translation,
	)
	hashtagLinks = new Collection<TranslationHashtagLink>(this);

	constructor(actor: User) {
		this.actor = Reference.create(actor);
		this.searchIndex = Reference.create(new TranslationSearchIndex(this));
	}

	get entryType(): EntryType.Translation {
		return EntryType.Translation;
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
		const searchIndex = this.searchIndex.getEntity();
		searchIndex.headword = ngramConverter.toFullText(
			this.translatedString.headword,
			2,
		);
		searchIndex.reading = ngramConverter.toFullText(
			this.translatedString.reading ?? '',
			2,
		);
		searchIndex.yamatokotoba = ngramConverter.toFullText(
			this.translatedString.yamatokotoba,
			2,
		);
	}

	takeSnapshot(): TranslationSnapshot {
		return TranslationSnapshot.create(this);
	}

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): TranslationRevision {
		return new TranslationRevision(
			this,
			commit,
			actor,
			this.takeSnapshot(),
			summary,
			event,
			version,
		);
	}

	createWebLink(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	): TranslationWebLink {
		return new TranslationWebLink(this, address, title, category);
	}

	createWorkLink(
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): TranslationWorkLink {
		return new TranslationWorkLink(
			this,
			relatedWork,
			linkType,
			beginDate,
			endDate,
			ended,
		);
	}

	createHashtagLink(relatedHashtag: Hashtag): TranslationHashtagLink {
		return new TranslationHashtagLink(this, relatedHashtag);
	}
}

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
	headword = '';

	@Property({ columnType: 'text', lazy: true })
	reading = '';

	@Property({ columnType: 'text', lazy: true })
	yamatokotoba = '';

	constructor(translation: Translation) {
		this.translation = translation;
	}

	get entry(): IEntryWithSearchIndex<TranslationSearchIndex> {
		return this.translation;
	}
}
