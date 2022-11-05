import { IPartialDateUpdateParams } from '@/models/IPartialDateUpdateParams';
import { LinkType } from '@/models/LinkType';

export interface IArtistLinkUpdateParams {
	id: number;
	relatedArtistId: number;
	linkType: LinkType;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
