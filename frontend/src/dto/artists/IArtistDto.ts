import { ArtistType } from './ArtistType';

export interface IArtistDto {
	id: number;
	name: string;
	artistType: ArtistType;
	avatarUrl?: string;
}
