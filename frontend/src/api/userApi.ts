import { IUserApiClientProvider } from '@/providers.abstractions/IUserApiClientProvider';
import { LocalDbUserApiClientProvider } from '@/providers.local-db/LocalDbUserApiClientProvider';
import { UserApiClientProvider } from '@/providers/UserApiClientProvider';

export const userApi: IUserApiClientProvider = true
	? new LocalDbUserApiClientProvider()
	: new UserApiClientProvider();
