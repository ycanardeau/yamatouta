import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { EntryType } from '@/models/EntryType';
import { IWorkUpdateParams } from '@/models/works/IWorkUpdateParams';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import { IWorkApiClientProvider } from '@/providers.abstractions/IWorkApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbWorkApiClientProvider implements IWorkApiClientProvider {
	async create({
		name,
		workType,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkDto> {
		throw new Error('Method not implemented.');
	}

	async delete({ id }: { id: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async get({
		id,
		fields,
	}: {
		id: number;
		fields?: WorkOptionalField[];
	}): Promise<IWorkDto> {
		return {
			id: 0,
			entryType: EntryType.Work,
			workType: WorkType.Unspecified,
			name: 'Work 1',
		};
	}

	async list({
		pagination,
		sort,
		query,
		workType,
	}: {
		pagination: IPaginationParams;
		sort?: WorkSortRule;
		query?: string;
		workType?: WorkType;
	}): Promise<ISearchResultDto<IWorkDto>> {
		return {
			items: [
				{
					id: 0,
					entryType: EntryType.Work,
					workType: WorkType.Unspecified,
					name: 'Work 1',
				},
			],
			totalCount: 1,
		};
	}

	async listRevisions({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> {
		return {
			items: [],
			totalCount: 1,
		};
	}

	async update({
		id,
		name,
		workType,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkDto> {
		throw new Error('Method not implemented.');
	}
}
