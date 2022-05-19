import { Link } from '../entities/Link';
import { Work } from '../entities/Work';
import { WorkLink } from '../entities/WorkLink';

export interface IWorkLinkFactory<TWorkLink extends WorkLink> {
	createWorkLink({ relatedWork }: { relatedWork: Work } & Link): TWorkLink;
}
