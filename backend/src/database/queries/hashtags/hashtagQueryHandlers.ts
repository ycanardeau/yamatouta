import { HashtagGetQueryHandler } from '@/database/queries/hashtags/HashtagGetQueryHandler';
import { HashtagListQueryHandler } from '@/database/queries/hashtags/HashtagListQueryHandler';

export const hashtagQueryHandlers = [
	HashtagGetQueryHandler,
	HashtagListQueryHandler,
];
