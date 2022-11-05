import { IWebLinkUpdateParams } from '@/models/IWebLinkUpdateParams';
import { ArtistType } from '@/models/artists/ArtistType';

export interface IArtistUpdateParams {
	id: number;
	name: string;
	artistType: ArtistType;
	webLinks: IWebLinkUpdateParams[];
}
