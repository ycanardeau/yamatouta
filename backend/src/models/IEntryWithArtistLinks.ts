import { Collection } from '@mikro-orm/core';

import { ArtistLink } from '../entities/ArtistLink';

export interface IEntryWithArtistLinks<TArtistLink extends ArtistLink> {
	artistLinks: Collection<TArtistLink>;
}
