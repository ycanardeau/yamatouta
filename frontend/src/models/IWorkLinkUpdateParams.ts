import { IPartialDateUpdateParams } from '@/models//IPartialDateUpdateParams';
import { LinkType } from '@/models/LinkType';

export interface IWorkLinkUpdateParams {
	id: number;
	relatedWorkId: number;
	linkType: LinkType;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
