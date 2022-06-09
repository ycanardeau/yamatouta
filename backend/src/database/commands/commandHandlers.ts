import { adminCommandHandlers } from './admin/adminCommandHandlers';
import { artistCommandHandlers } from './artists/artistCommandHandlers';
import { quoteCommandHandlers } from './quotes/quoteCommandHandlers';
import { translationCommandHandlers } from './translations/translationCommandHandlers';
import { userCommandHandlers } from './users/userCommandHandlers';
import { workCommandHandlers } from './works/workCommandHandlers';

export const commandHandlers = [
	...adminCommandHandlers,
	...artistCommandHandlers,
	...quoteCommandHandlers,
	...translationCommandHandlers,
	...userCommandHandlers,
	...workCommandHandlers,
];
