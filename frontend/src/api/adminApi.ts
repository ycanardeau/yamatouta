import axios from 'axios';

class AdminApi {
	createMissingRevisions = async (): Promise<void> => {
		const response = await axios.post<void>(
			'/admin/create-missing-revisions',
		);

		return response.data;
	};

	generateSitemaps = async (): Promise<void> => {
		const response = await axios.post<void>('/admin/generate-sitemaps');

		return response.data;
	};

	updateSearchIndex = async ({
		forceUpdate,
	}: {
		forceUpdate: boolean;
	}): Promise<void> => {
		const response = await axios.post<void>('/admin/update-search-index', {
			forceUpdate: forceUpdate,
		});

		return response.data;
	};
}

export const adminApi = new AdminApi();
