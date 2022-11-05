import { WorkListRevisionsQueryHandler } from '@/database/queries/EntryListRevisionsQueryHandler';
import { WorkGetQueryHandler } from '@/database/queries/works/WorkGetQueryHandler';
import { WorkListQueryHandler } from '@/database/queries/works/WorkListQueryHandler';

export const workQueryHandlers = [
	WorkGetQueryHandler,
	WorkListQueryHandler,
	WorkListRevisionsQueryHandler,
];
