import { Artist } from '../entities/Artist';
import { ArtistLink } from '../entities/ArtistLink';
import { PartialDate } from '../entities/PartialDate';
import { LinkType } from './LinkType';

export interface IArtistLinkFactory<TArtistLink extends ArtistLink> {
	createArtistLink(
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): TArtistLink;
}
