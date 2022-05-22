import axios from 'axios';

class AdminApi {
	createMissingRevisions = async (): Promise<void> => {
		const response = await axios.post<void>(
			'/admin/create-missing-revisions',
		);

		return response.data;
	};
}

export const adminApi = new AdminApi();
