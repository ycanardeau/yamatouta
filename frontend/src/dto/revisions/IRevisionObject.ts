import { RevisionEvent } from '../../models/RevisionEvent';
import { IUserObject } from '../users/IUserObject';

export interface IRevisionObject {
	actor: IUserObject;
	createdAt: Date;
	event: RevisionEvent;
}
