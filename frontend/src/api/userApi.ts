import axios from 'axios';

import { IAuthenticatedUserObject } from '../dto/IAuthenticatedUserObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IUserObject } from '../dto/IUserObject';
import { UserGroup } from '../models/users/UserGroup';
import { UserSortRule } from '../models/users/UserSortRule';
import { IPaginationParams } from '../stores/PaginationStore';

class UserApi {
	create = async ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}): Promise<IAuthenticatedUserObject> => {
		const response = await axios.post<IAuthenticatedUserObject>(
			'/users/create',
			{
				email,
				username,
				password,
			},
		);

		return response.data;
	};

	get = async ({ id }: { id: number }): Promise<IUserObject> => {
		const response = await axios.get<IUserObject>(`/users/get`, {
			params: { id: id },
		});

		return response.data;
	};

	getCurrent = async (): Promise<IAuthenticatedUserObject> => {
		const response = await axios.get<IAuthenticatedUserObject>(
			'/users/get-current',
		);

		return response.data;
	};

	list = async ({
		pagination,
		sort,
		query,
		userGroup,
	}: {
		pagination: IPaginationParams;
		sort?: UserSortRule;
		query?: string;
		userGroup?: UserGroup;
	}): Promise<ISearchResultObject<IUserObject>> => {
		const response = await axios.get<ISearchResultObject<IUserObject>>(
			'/users/list',
			{ params: { ...pagination, sort, query, userGroup } },
		);

		return response.data;
	};

	update = async ({
		password,
		email,
		username,
		newPassword,
	}: {
		password: string;
		email?: string;
		username?: string;
		newPassword?: string;
	}): Promise<IAuthenticatedUserObject> => {
		const response = await axios.post<IAuthenticatedUserObject>(
			'/users/update',
			{
				password: password,
				email: email,
				username: username,
				newPassword: newPassword,
			},
		);

		return response.data;
	};
}

export const userApi = new UserApi();
