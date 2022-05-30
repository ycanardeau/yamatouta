import { IPartialDateUpdateParams } from './IPartialDateUpdateParams';
import { LinkType } from './LinkType';

export interface IArtistLinkUpdateParams {
	id: number;
	relatedArtistId: number;
	linkType: LinkType;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
