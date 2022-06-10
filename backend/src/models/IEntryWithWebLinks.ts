import { Collection } from '@mikro-orm/core';

import { WebAddress } from '../entities/WebAddress';
import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from './WebLinkCategory';

export interface IEntryWithWebLinks<TWebLink extends WebLink> {
	webLinks: Collection<TWebLink>;

	createWebLink(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	): TWebLink;
}
