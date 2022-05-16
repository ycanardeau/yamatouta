import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { IWorkObject } from '../dto/IWorkObject';
import { WorkOptionalField } from '../models/WorkOptionalField';
import { WorkType } from '../models/WorkType';
import { IPaginationParams } from '../stores/PaginationStore';

export const listWorks = async ({
	pagination,
	query,
}: {
	pagination: IPaginationParams;
	query?: string;
}): Promise<ISearchResultObject<IWorkObject>> => {
	const response = await axios.get<ISearchResultObject<IWorkObject>>(
		'/works',
		{ params: { ...pagination, query } },
	);

	return response.data;
};

export const getWork = async ({
	workId,
	fields,
}: {
	workId: number;
	fields?: WorkOptionalField[];
}): Promise<IWorkObject> => {
	const response = await axios.get<IWorkObject>(`/works/${workId}`, {
		params: { fields: fields },
	});

	return response.data;
};

export const createWork = async ({
	name,
	workType,
	webLinks,
}: {
	name: string;
	workType: WorkType;
	webLinks: IWebLinkObject[];
}): Promise<IWorkObject> => {
	const response = await axios.post<IWorkObject>('/works', {
		name,
		workType,
		webLinks,
	});

	return response.data;
};

export const updateWork = async ({
	workId,
	name,
	workType,
	webLinks,
}: {
	workId: number;
	name: string;
	workType: WorkType;
	webLinks: IWebLinkObject[];
}): Promise<IWorkObject> => {
	const response = await axios.patch<IWorkObject>(`/works/${workId}`, {
		name,
		workType,
		webLinks,
	});

	return response.data;
};

export const deleteWork = async ({
	workId,
}: {
	workId: number;
}): Promise<void> => {
	await axios.delete<void>(`/works/${workId}`);
};
