import { Collection } from '@mikro-orm/core';

import { PartialDate } from '../entities/PartialDate';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';
import { IEntryWithEntryType } from './IEntryWithEntryType';
import { LinkType, workLinkTypes } from './LinkType';

export interface IEntryWithWorkLinks<
	TEntryType extends keyof typeof workLinkTypes,
	TWorkLink extends WorkLink,
> extends IEntryWithEntryType<TEntryType> {
	workLinks: Collection<TWorkLink>;

	createWorkLink(
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): TWorkLink;
}
