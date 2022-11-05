import { IArtistLinkUpdateParams } from '@/models/IArtistLinkUpdateParams';
import { IWebLinkUpdateParams } from '@/models/IWebLinkUpdateParams';
import { WorkType } from '@/models/works/WorkType';

export interface IWorkUpdateParams {
	id: number;
	name: string;
	workType: WorkType;
	webLinks: IWebLinkUpdateParams[];
	artistLinks: IArtistLinkUpdateParams[];
}
