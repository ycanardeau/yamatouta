import { IHashtagDto } from '@/dto/IHashtagDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class HashtagApi {
	get = async ({ name }: { name: string }): Promise<IHashtagDto> => {
		const response = await axios.get<IHashtagDto>(`/hashtags/get`, {
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
	}): Promise<ISearchResultDto<IHashtagDto>> => {
		const response = await axios.get<ISearchResultDto<IHashtagDto>>(
			'/hashtags/list',
			{ params: { ...pagination, sort, query } },
		);

		return response.data;
	};
}

export const hashtagApi = new HashtagApi();
