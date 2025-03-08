import axios from 'axios';

class AdminApi {
	async createMissingRevisions(): Promise<void> {
		const response = await axios.post<void>(
			'/admin/create-missing-revisions',
		);

		return response.data;
	}

	async generateSitemaps(): Promise<void> {
		const response = await axios.post<void>('/admin/generate-sitemaps');

		return response.data;
	}

	async updateSearchIndex({
		forceUpdate,
	}: {
		forceUpdate: boolean;
	}): Promise<void> {
		const response = await axios.post<void>('/admin/update-search-index', {
			forceUpdate: forceUpdate,
		});

		return response.data;
	}
}

export const adminApi = new AdminApi();
