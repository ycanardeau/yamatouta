import axios from 'axios';

export const createMissingRevisions = async (): Promise<void> => {
	const response = await axios.post<void>('/admin/create-missing-revisions');

	return response.data;
};
