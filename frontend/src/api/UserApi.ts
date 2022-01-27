import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IAuthenticatedUserObject } from '../dto/users/IAuthenticatedUserObject';
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

export const getAuthenticatedUser =
	async (): Promise<IAuthenticatedUserObject> => {
		const response = await axios.get<IAuthenticatedUserObject>(
			'/users/current',
		);

		return response.data;
	};

export const updateAuthenticatedUser = async (params: {
	password: string;
	email?: string;
	newPassword?: string;
}): Promise<IAuthenticatedUserObject> => {
	const { password, email, newPassword } = params;

	const response = await axios.patch<IAuthenticatedUserObject>(
		'/users/current',
		{
			password: password,
			email: email,
			newPassword: newPassword,
		},
	);

	return response.data;
};
