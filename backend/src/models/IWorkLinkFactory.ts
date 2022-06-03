import { PartialDate } from '../entities/PartialDate';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';
import { LinkType } from './LinkType';

export interface IWorkLinkFactory<TWorkLink extends WorkLink> {
	createWorkLink(
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): TWorkLink;
}
