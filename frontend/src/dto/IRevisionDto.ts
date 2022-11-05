import { IUserDto } from '@/dto/IUserDto';
import { RevisionEvent } from '@/models/RevisionEvent';

export interface IRevisionDto {
	actor: IUserDto;
	createdAt: Date;
	event: RevisionEvent;
}
