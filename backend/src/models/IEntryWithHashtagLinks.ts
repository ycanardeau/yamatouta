import { Collection } from '@mikro-orm/core';

import { Hashtag } from '../entities/Hashtag';
import { HashtagLink } from '../entities/HashtagLink';

export interface IEntryWithHashtagLinks<THashtagLink extends HashtagLink> {
	hashtagLinks: Collection<THashtagLink>;
	createHashtagLink(relatedHashtag: Hashtag, label: string): THashtagLink;
}
