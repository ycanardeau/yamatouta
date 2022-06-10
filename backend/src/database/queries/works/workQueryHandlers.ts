import { WorkListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { WorkGetQueryHandler } from './WorkGetQueryHandler';
import { WorkListQueryHandler } from './WorkListQueryHandler';

export const workQueryHandlers = [
	WorkGetQueryHandler,
	WorkListQueryHandler,
	WorkListRevisionsQueryHandler,
];
