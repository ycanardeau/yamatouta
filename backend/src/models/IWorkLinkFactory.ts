import { Link } from '../entities/Link';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';

export interface IWorkLinkFactory<TWorkLink extends WorkLink> {
	createWorkLink({ relatedWork }: Link & { relatedWork: Work }): TWorkLink;
}
