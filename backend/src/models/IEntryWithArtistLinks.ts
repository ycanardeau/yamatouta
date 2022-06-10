import { Collection } from '@mikro-orm/core';

import { Artist } from '../entities/Artist';
import { ArtistLink } from '../entities/ArtistLink';
import { PartialDate } from '../entities/PartialDate';
import { IEntryWithEntryType } from './IEntryWithEntryType';
import { artistLinkTypes, LinkType } from './LinkType';

export interface IEntryWithArtistLinks<
	TEntryType extends keyof typeof artistLinkTypes,
	TArtistLink extends ArtistLink,
> extends IEntryWithEntryType<TEntryType> {
	artistLinks: Collection<TArtistLink>;

	createArtistLink(
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): TArtistLink;
}
