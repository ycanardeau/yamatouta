export interface IAdminApiClientProvider {
	createMissingRevisions(): Promise<void>;
	generateSitemaps(): Promise<void>;
	updateSearchIndex(request: { forceUpdate: boolean }): Promise<void>;
}
