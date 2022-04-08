import axios from 'axios';

export const createRevisions = async (): Promise<void> => {
	const response = await axios.post<void>('/admin/create-revisions');

	return response.data;
};
