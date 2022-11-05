import { QuoteDeleteCommandHandler } from '@/database/commands/EntryDeleteCommandHandler';
import { QuoteUpdateCommandHandler } from '@/database/commands/quotes/QuoteUpdateCommandHandler';

export const quoteCommandHandlers = [
	QuoteDeleteCommandHandler,
	QuoteUpdateCommandHandler,
];
