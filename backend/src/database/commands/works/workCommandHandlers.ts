import { WorkDeleteCommandHandler } from '@/database/commands/EntryDeleteCommandHandler';
import { WorkUpdateCommandHandler } from '@/database/commands/works/WorkUpdateCommandHandler';

export const workCommandHandlers = [
	WorkDeleteCommandHandler,
	WorkUpdateCommandHandler,
];
