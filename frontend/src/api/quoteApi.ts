import { IQuoteApiClientProvider } from '@/providers.abstractions/IQuoteApiClientProvider';
import { LocalDbQuoteApiClientProvider } from '@/providers.local-db/LocalDbQuoteApiClientProvider';
import { QuoteApiClientProvider } from '@/providers/QuoteApiClientProvider';

export const quoteApi: IQuoteApiClientProvider = true
	? new LocalDbQuoteApiClientProvider()
	: new QuoteApiClientProvider();
