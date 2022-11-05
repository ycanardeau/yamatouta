import { IUserObject } from '@/dto/IUserObject';
import { RevisionEvent } from '@/models/RevisionEvent';

export interface IRevisionObject {
	actor: IUserObject;
	createdAt: Date;
	event: RevisionEvent;
}
