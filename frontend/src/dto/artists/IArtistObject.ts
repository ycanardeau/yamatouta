import { ArtistType } from '../../models/ArtistType';

export interface IArtistObject {
	id: number;
	name: string;
	artistType: ArtistType;
	avatarUrl?: string;
}
