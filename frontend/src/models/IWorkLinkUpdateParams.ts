import { IPartialDateUpdateParams } from './IPartialDateUpdateParams';

export interface IWorkLinkUpdateParams {
	id: number;
	linkTypeId: number;
	relatedWorkId: number;
	beginDate: IPartialDateUpdateParams;
	endDate: IPartialDateUpdateParams;
	ended: boolean;
}
