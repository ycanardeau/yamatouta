import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { IWorkUpdateParams } from '@/models/works/IWorkUpdateParams';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class WorkApi {
	async create({
		name,
		workType,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkDto> {
		const response = await axios.post<IWorkDto>('/works/create', {
			id: 0,
			name,
			workType,
			webLinks,
			artistLinks,
		});

		return response.data;
	}

	async delete({ id }: { id: number }): Promise<void> {
		await axios.delete<void>(`/works/delete`, { data: { id: id } });
	}

	async get({
		id,
		fields,
	}: {
		id: number;
		fields?: WorkOptionalField[];
	}): Promise<IWorkDto> {
		const response = await axios.get<IWorkDto>(`/works/get`, {
			params: { id: id, fields: fields },
		});

		return response.data;
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
		const response = await axios.get<ISearchResultDto<IWorkDto>>(
			'/works/list',
			{ params: { ...pagination, sort, query, workType } },
		);

		return response.data;
	}

	async listRevisions({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> {
		const response = await axios.get<ISearchResultDto<IRevisionDto>>(
			`/works/list-revisions`,
			{ params: { id: id } },
		);

		return response.data;
	}

	async update({
		id,
		name,
		workType,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkDto> {
		const response = await axios.post<IWorkDto>(`/works/update`, {
			id: id,
			name,
			workType,
			webLinks,
			artistLinks,
		});

		return response.data;
	}
}

export const workApi = new WorkApi();
