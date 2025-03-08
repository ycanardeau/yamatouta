import { ITranslationApiClientProvider } from '@/providers.abstractions/ITranslationApiClientProvider';
import { LocalDbTranslationApiClientProvider } from '@/providers.local-db/LocalDbTranslationApiClientProvider';
import { TranslationApiClientProvider } from '@/providers/TranslationApiClientProvider';

export const translationApi: ITranslationApiClientProvider = true
	? new LocalDbTranslationApiClientProvider()
	: new TranslationApiClientProvider();
