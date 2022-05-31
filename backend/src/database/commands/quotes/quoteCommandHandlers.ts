import { QuoteDeleteCommandHandler } from '../EntryDeleteCommandHandler';
import { QuoteUpdateCommandHandler } from './QuoteUpdateCommandHandler';

export const quoteCommandHandlers = [
	QuoteDeleteCommandHandler,
	QuoteUpdateCommandHandler,
];
