import { WorkListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { WorkGetQueryHandler } from './WorkGetQueryHandler';
import { WorkListIdsQueryHandler } from './WorkListIdsQueryHandler';
import { WorkListQueryHandler } from './WorkListQueryHandler';

export const workQueryHandlers = [
	WorkGetQueryHandler,
	WorkListIdsQueryHandler,
	WorkListQueryHandler,
	WorkListRevisionsQueryHandler,
];
