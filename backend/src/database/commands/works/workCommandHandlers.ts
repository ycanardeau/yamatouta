import { WorkDeleteCommandHandler } from '../EntryDeleteCommandHandler';
import { WorkUpdateCommandHandler } from './WorkUpdateCommandHandler';

export const workCommandHandlers = [
	WorkDeleteCommandHandler,
	WorkUpdateCommandHandler,
];
