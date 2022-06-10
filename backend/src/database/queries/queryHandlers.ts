import { artistQueryHandlers } from './artists/artistQueryHandlers';
import { quoteQueryHandlers } from './quotes/quoteQueryHandlers';
import { translationQueryHandlers } from './translations/translationQueryHandlers';
import { userQueryHandlers } from './users/userQueryHandlers';
import { workQueryHandlers } from './works/workQueryHandlers';

export const queryHandlers = [
	...artistQueryHandlers,
	...quoteQueryHandlers,
	...translationQueryHandlers,
	...userQueryHandlers,
	...workQueryHandlers,
];
