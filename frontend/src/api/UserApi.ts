import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IUserObject } from '../dto/users/IUserObject';
import { IPaginationParams } from '../stores/PaginationStore';

export const listUsers = async (params: {
	pagination: IPaginationParams;
}): Promise<ISearchResultObject<IUserObject>> => {
	const { pagination } = params;

	const response = await axios.get<ISearchResultObject<IUserObject>>(
		'/users',
		{ params: { ...pagination } },
	);

	return response.data;
};

export const getUser = async (userId: number): Promise<IUserObject> => {
	const response = await axios.get<IUserObject>(`/users/${userId}`);

	return response.data;
};
