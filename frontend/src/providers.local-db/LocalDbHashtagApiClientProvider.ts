import { IHashtagDto } from '@/dto/IHashtagDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { IHashtagApiClientProvider } from '@/providers.abstractions/IHashtagApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbHashtagApiClientProvider
	implements IHashtagApiClientProvider
{
	async get({ name }: { name: string }): Promise<IHashtagDto> {
		return {
			name: 'Hashtag 1',
			referenceCount: 1,
		};
	}

	async list({
		pagination,
		sort,
		query,
	}: {
		pagination: IPaginationParams;
		sort?: HashtagSortRule;
		query?: string;
	}): Promise<ISearchResultDto<IHashtagDto>> {
		return {
			items: [
				{
					name: 'Hashtag 1',
					referenceCount: 1,
				},
			],
			totalCount: 1,
		};
	}
}
