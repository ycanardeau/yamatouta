import { AdminCreateMissingRevisionsCommandHandler } from './admin/AdminCreateMissingRevisionsCommandHandler';
import { artistCommandHandlers } from './artists/artistCommandHandlers';
import { quoteCommandHandlers } from './quotes/quoteCommandHandlers';
import { translationCommandHandlers } from './translations/translationCommandHandlers';
import { userCommandHandlers } from './users/userCommandHandlers';
import { workCommandHandlers } from './works/workCommandHandlers';

export const commandHandlers = [
	AdminCreateMissingRevisionsCommandHandler,
	...artistCommandHandlers,
	...quoteCommandHandlers,
	...translationCommandHandlers,
	...userCommandHandlers,
	...workCommandHandlers,
];
