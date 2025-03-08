import { IWorkApiClientProvider } from '@/providers.abstractions/IWorkApiClientProvider';
import { LocalDbWorkApiClientProvider } from '@/providers.local-db/LocalDbWorkApiClientProvider';
import { WorkApiClientProvider } from '@/providers/WorkApiClientProvider';

export const workApi: IWorkApiClientProvider = true
	? new LocalDbWorkApiClientProvider()
	: new WorkApiClientProvider();
