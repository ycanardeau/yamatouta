import axios from 'axios';

import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { IWorkObject } from '../dto/IWorkObject';
import { WorkOptionalField } from '../models/WorkOptionalField';
import { WorkType } from '../models/WorkType';
import { IPaginationParams } from '../stores/PaginationStore';

class WorkApi {
	create = async ({
		name,
		workType,
		webLinks,
	}: {
		name: string;
		workType: WorkType;
		webLinks: IWebLinkObject[];
	}): Promise<IWorkObject> => {
		const response = await axios.post<IWorkObject>('/works/create', {
			id: 0,
			name,
			workType,
			webLinks,
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
		query,
	}: {
		pagination: IPaginationParams;
		query?: string;
	}): Promise<ISearchResultObject<IWorkObject>> => {
		const response = await axios.get<ISearchResultObject<IWorkObject>>(
			'/works/list',
			{ params: { ...pagination, query } },
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
		webLinks,
	}: {
		id: number;
		name: string;
		workType: WorkType;
		webLinks: IWebLinkObject[];
	}): Promise<IWorkObject> => {
		const response = await axios.post<IWorkObject>(`/works/update`, {
			id: id,
			name,
			workType,
			webLinks,
		});

		return response.data;
	};
}

export const workApi = new WorkApi();
