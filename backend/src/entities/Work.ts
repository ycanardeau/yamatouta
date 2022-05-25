import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { WorkSnapshot } from '../models/snapshots/WorkSnapshot';
import { WorkType } from '../models/works/WorkType';
import { Commit } from './Commit';
import { WorkRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { WorkWebLink } from './WebLink';

@Entity({ tableName: 'works' })
export class Work
	implements
		IEntryWithRevisions<Work, WorkRevision, WorkSnapshot>,
		IRevisionFactory<Work, WorkRevision, WorkSnapshot>,
		IWebLinkFactory<WorkWebLink>
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

	@Property()
	name!: string;

	@Enum()
	workType!: WorkType;

	@Property()
	version = 0;

	@OneToMany(() => WorkRevision, (revision) => revision.work)
	revisions = new Collection<WorkRevision>(this);

	@OneToMany(() => WorkWebLink, (webLink) => webLink.work)
	webLinks = new Collection<WorkWebLink>(this);

	takeSnapshot(): WorkSnapshot {
		return new WorkSnapshot(this);
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
	}): WorkRevision {
		return new WorkRevision({
			work: this,
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
	}): WorkWebLink {
		return new WorkWebLink({
			work: this,
			address: address,
			title: title,
			category: category,
		});
	}
}
