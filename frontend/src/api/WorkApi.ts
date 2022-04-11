import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWorkObject } from '../dto/works/IWorkObject';
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
}: {
	workId: number;
}): Promise<IWorkObject> => {
	const response = await axios.get<IWorkObject>(`/works/${workId}`);

	return response.data;
};

export const createWork = async ({
	name,
	workType,
}: {
	name: string;
	workType: WorkType;
}): Promise<IWorkObject> => {
	const response = await axios.post<IWorkObject>('/works', {
		name,
		workType,
	});

	return response.data;
};

export const updateWork = async ({
	workId,
	name,
	workType,
}: {
	workId: number;
	name: string;
	workType: WorkType;
}): Promise<IWorkObject> => {
	const response = await axios.patch<IWorkObject>(`/works/${workId}`, {
		name,
		workType,
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
