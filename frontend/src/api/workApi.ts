import axios from 'axios';

import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWorkObject } from '../dto/IWorkObject';
import { IWorkUpdateParams } from '../models/works/IWorkUpdateParams';
import { WorkOptionalField } from '../models/works/WorkOptionalField';
import { WorkSortRule } from '../models/works/WorkSortRule';
import { WorkType } from '../models/works/WorkType';
import { IPaginationParams } from '../stores/PaginationStore';

class WorkApi {
	create = async ({
		name,
		workType,
		hashtagLinks,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkObject> => {
		const response = await axios.post<IWorkObject>('/works/create', {
			id: 0,
			name,
			workType,
			hashtagLinks,
			webLinks,
			artistLinks,
		});

		return response.data;
	};

	delete = async ({ id }: { id: number }): Promise<void> => {
		await axios.delete<void>(`/works/delete`, { data: { id: id } });
	};

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: WorkOptionalField[];
	}): Promise<IWorkObject> => {
		const response = await axios.get<IWorkObject>(`/works/get`, {
			params: { id: id, fields: fields },
		});

		return response.data;
	};

	list = async ({
		pagination,
		sort,
		query,
		workType,
	}: {
		pagination: IPaginationParams;
		sort?: WorkSortRule;
		query?: string;
		workType?: WorkType;
	}): Promise<ISearchResultObject<IWorkObject>> => {
		const response = await axios.get<ISearchResultObject<IWorkObject>>(
			'/works/list',
			{ params: { ...pagination, sort, query, workType } },
		);

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultObject<IRevisionObject>> => {
		const response = await axios.get<ISearchResultObject<IRevisionObject>>(
			`/works/list-revisions`,
			{ params: { id: id } },
		);

		return response.data;
	};

	update = async ({
		id,
		name,
		workType,
		hashtagLinks,
		webLinks,
		artistLinks,
	}: IWorkUpdateParams): Promise<IWorkObject> => {
		const response = await axios.post<IWorkObject>(`/works/update`, {
			id: id,
			name,
			workType,
			hashtagLinks,
			webLinks,
			artistLinks,
		});

		return response.data;
	};
}

export const workApi = new WorkApi();
