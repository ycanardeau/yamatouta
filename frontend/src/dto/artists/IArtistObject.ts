import { ArtistType } from '../../models/ArtistType';
import { IEntryWithIdAndName } from '../../models/IEntryWithIdAndName';

export interface IArtistObject extends IEntryWithIdAndName {
	artistType: ArtistType;
	avatarUrl?: string;
}
