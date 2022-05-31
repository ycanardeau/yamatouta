import { IPartialDateUpdateParams } from './IPartialDateUpdateParams';
import { LinkType } from './LinkType';

export interface IWorkLinkUpdateParams {
	id: number;
	relatedWorkId: number;
	linkType: LinkType;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
