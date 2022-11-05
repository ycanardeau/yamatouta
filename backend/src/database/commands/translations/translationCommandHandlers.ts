import { TranslationDeleteCommandHandler } from '@/database/commands/EntryDeleteCommandHandler';
import { TranslationUpdateCommandHandler } from '@/database/commands/translations/TranslationUpdateCommandHandler';

export const translationCommandHandlers = [
	TranslationDeleteCommandHandler,
	TranslationUpdateCommandHandler,
];
