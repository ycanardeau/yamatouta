import { IHashtagDto } from '@/dto/IHashtagDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface IHashtagApiClientProvider {
	get(request: { name: string }): Promise<IHashtagDto>;
	list(request: {
		pagination: IPaginationParams;
		sort?: HashtagSortRule;
		query?: string;
	}): Promise<ISearchResultDto<IHashtagDto>>;
}
