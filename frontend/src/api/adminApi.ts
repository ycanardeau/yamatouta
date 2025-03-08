import { IAdminApiClientProvider } from '@/providers.abstractions/IAdminApiClientProvider';
import { LocalDbAdminApiClientProvider } from '@/providers.local-db/LocalDbAdminApiClientProvider';
import { AdminApiClientProvider } from '@/providers/AdminApiClientProvider';

export const adminApi: IAdminApiClientProvider = true
	? new LocalDbAdminApiClientProvider()
	: new AdminApiClientProvider();
