import { LinkType } from '@/models/LinkType';

export interface IArtistLink {
	relatedArtistId: number;
	linkType: LinkType;
}
