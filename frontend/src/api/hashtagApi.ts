import { IHashtagApiClientProvider } from '@/providers.abstractions/IHashtagApiClientProvider';
import { LocalDbHashtagApiClientProvider } from '@/providers.local-db/LocalDbHashtagApiClientProvider';
import { HashtagApiClientProvider } from '@/providers/HashtagApiClientProvider';

export const hashtagApi: IHashtagApiClientProvider = true
	? new LocalDbHashtagApiClientProvider()
	: new HashtagApiClientProvider();
