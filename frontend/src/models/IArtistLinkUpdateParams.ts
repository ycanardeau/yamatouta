import { IPartialDateUpdateParams } from './IPartialDateUpdateParams';

export interface IArtistLinkUpdateParams {
	id: number;
	linkTypeId: number;
	relatedArtistId: number;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
