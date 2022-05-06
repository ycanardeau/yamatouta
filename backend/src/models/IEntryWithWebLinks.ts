import { Collection } from '@mikro-orm/core';

import { WebLink } from '../entities/WebLink';

export interface IEntryWithWebLinks<TWebLink extends WebLink> {
	webLinks: Collection<TWebLink>;
}
