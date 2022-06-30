import { artistQueryHandlers } from './artists/artistQueryHandlers';
import { hashtagQueryHandlers } from './hashtags/hashtagQueryHandlers';
import { quoteQueryHandlers } from './quotes/quoteQueryHandlers';
import { translationQueryHandlers } from './translations/translationQueryHandlers';
import { userQueryHandlers } from './users/userQueryHandlers';
import { workQueryHandlers } from './works/workQueryHandlers';

export const queryHandlers = [
	...artistQueryHandlers,
	...hashtagQueryHandlers,
	...quoteQueryHandlers,
	...translationQueryHandlers,
	...userQueryHandlers,
	...workQueryHandlers,
];
