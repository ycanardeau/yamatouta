import { artistQueryHandlers } from '@/database/queries/artists/artistQueryHandlers';
import { hashtagQueryHandlers } from '@/database/queries/hashtags/hashtagQueryHandlers';
import { quoteQueryHandlers } from '@/database/queries/quotes/quoteQueryHandlers';
import { translationQueryHandlers } from '@/database/queries/translations/translationQueryHandlers';
import { userQueryHandlers } from '@/database/queries/users/userQueryHandlers';
import { workQueryHandlers } from '@/database/queries/works/workQueryHandlers';

export const queryHandlers = [
	...artistQueryHandlers,
	...hashtagQueryHandlers,
	...quoteQueryHandlers,
	...translationQueryHandlers,
	...userQueryHandlers,
	...workQueryHandlers,
];
