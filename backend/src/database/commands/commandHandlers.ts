import { adminCommandHandlers } from '@/database/commands/admin/adminCommandHandlers';
import { artistCommandHandlers } from '@/database/commands/artists/artistCommandHandlers';
import { quoteCommandHandlers } from '@/database/commands/quotes/quoteCommandHandlers';
import { translationCommandHandlers } from '@/database/commands/translations/translationCommandHandlers';
import { userCommandHandlers } from '@/database/commands/users/userCommandHandlers';
import { workCommandHandlers } from '@/database/commands/works/workCommandHandlers';

export const commandHandlers = [
	...adminCommandHandlers,
	...artistCommandHandlers,
	...quoteCommandHandlers,
	...translationCommandHandlers,
	...userCommandHandlers,
	...workCommandHandlers,
];
