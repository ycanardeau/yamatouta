import { AdminCreateMissingRevisionsCommandHandler } from '@/database/commands/admin/AdminCreateMissingRevisionsCommandHandler';
import { AdminUpdateSearchIndexCommandHandler } from '@/database/commands/admin/AdminUpdateSearchIndexCommandHandler';

export const adminCommandHandlers = [
	AdminCreateMissingRevisionsCommandHandler,
	AdminUpdateSearchIndexCommandHandler,
];
