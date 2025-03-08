import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { IWorkUpdateParams } from '@/models/works/IWorkUpdateParams';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface IWorkApiClientProvider {
	create(request: IWorkUpdateParams): Promise<IWorkDto>;
	delete(request: { id: number }): Promise<void>;
	get(request: {
		id: number;
		fields?: WorkOptionalField[];
	}): Promise<IWorkDto>;
	list(request: {
		pagination: IPaginationParams;
		sort?: WorkSortRule;
		query?: string;
		workType?: WorkType;
	}): Promise<ISearchResultDto<IWorkDto>>;
	listRevisions(request: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>>;
	update(request: IWorkUpdateParams): Promise<IWorkDto>;
}
