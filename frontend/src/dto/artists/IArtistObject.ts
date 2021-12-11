import { ArtistType } from './ArtistType';

export interface IArtistObject {
	id: number;
	name: string;
	artistType: ArtistType;
	avatarUrl?: string;
}
