import axios from 'axios';

import { config } from '../config';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IUserObject } from '../dto/users/IUserObject';
import { IPaginationParams } from '../stores/PaginationStore';

export const listUsers = async (params: {
	pagination: IPaginationParams;
}): Promise<ISearchResultObject<IUserObject>> => {
	const { pagination } = params;

	const response = await axios.get<ISearchResultObject<IUserObject>>(
		`${config.apiEndpoint}/users`,
		{ params: { ...pagination } },
	);

	return response.data;
};
