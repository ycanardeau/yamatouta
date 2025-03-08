import { IAdminApiClientProvider } from '@/providers.abstractions/IAdminApiClientProvider';

export class LocalDbAdminApiClientProvider implements IAdminApiClientProvider {
	async createMissingRevisions(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async generateSitemaps(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async updateSearchIndex({
		forceUpdate,
	}: {
		forceUpdate: boolean;
	}): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
