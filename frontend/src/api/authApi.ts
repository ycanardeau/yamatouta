import { IAuthApiClientProvider } from '@/providers.abstractions/IAuthApiClientProvider';
import { LocalDbAuthApiClientProvider } from '@/providers.local-db/LocalDbAuthApiClientProvider';
import { AuthApiClientProvider } from '@/providers/AuthApiClientProvider';

export const authApi: IAuthApiClientProvider = true
	? new LocalDbAuthApiClientProvider()
	: new AuthApiClientProvider();
