import { Collection } from '@mikro-orm/core';

import { WorkLink } from '../entities/WorkLink';

export interface IEntryWithWorkLinks<TWorkLink extends WorkLink> {
	workLinks: Collection<TWorkLink>;
}
