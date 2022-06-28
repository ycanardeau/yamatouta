import axios from 'axios';

import { IHashtagObject } from '../dto/IHashtagObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { HashtagSortRule } from '../models/hashtags/HashtagSortRule';
import { IPaginationParams } from '../stores/PaginationStore';

class HashtagApi {
	get = async ({ name }: { name: string }): Promise<IHashtagObject> => {
		const response = await axios.get<IHashtagObject>(`/hashtags/get`, {
			params: { name: name },
		});

		return response.data;
	};

	list = async ({
		pagination,
		sort,
		query,
	}: {
		pagination: IPaginationParams;
		sort?: HashtagSortRule;
		query?: string;
	}): Promise<ISearchResultObject<IHashtagObject>> => {
		const response = await axios.get<ISearchResultObject<IHashtagObject>>(
			'/hashtags/list',
			{ params: { ...pagination, sort, query } },
		);

		return response.data;
	};
}

export const hashtagApi = new HashtagApi();
