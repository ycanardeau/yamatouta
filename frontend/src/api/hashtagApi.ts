import axios from 'axios';

import { IHashtagObject } from '../dto/IHashtagObject';

class HashtagApi {
	get = async ({ name }: { name: string }): Promise<IHashtagObject> => {
		const response = await axios.get<IHashtagObject>(`/hashtags/get`, {
			params: { name: name },
		});

		return response.data;
	};
}

export const hashtagApi = new HashtagApi();
