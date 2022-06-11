import { Collection } from '@mikro-orm/core';

import { HashtagLink } from '../entities/HashtagLink';

export interface IEntryWithHashtagLinks<THashtagLink extends HashtagLink> {
	hashtagLinks: Collection<THashtagLink>;
}
