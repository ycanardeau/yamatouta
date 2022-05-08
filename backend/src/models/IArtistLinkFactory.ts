import { Artist } from '../entities/Artist';
import { ArtistLink } from '../entities/ArtistLink';
import { Link } from '../entities/Link';

export interface IArtistLinkFactory<TArtistLink extends ArtistLink> {
	createArtistLink({
		relatedArtist,
	}: Link & { relatedArtist: Artist }): TArtistLink;
}
