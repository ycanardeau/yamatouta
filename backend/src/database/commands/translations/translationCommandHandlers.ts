import { TranslationDeleteCommandHandler } from '../EntryDeleteCommandHandler';
import { TranslationUpdateCommandHandler } from './TranslationUpdateCommandHandler';

export const translationCommandHandlers = [
	TranslationDeleteCommandHandler,
	TranslationUpdateCommandHandler,
];
