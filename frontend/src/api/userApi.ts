import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IUserDto } from '@/dto/IUserDto';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class UserApi {
	create = async ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}): Promise<IAuthenticatedUserDto> => {
		const response = await axios.post<IAuthenticatedUserDto>(
			'/users/create',
			{
				email,
				username,
				password,
			},
		);

		return response.data;
	};

	get = async ({ id }: { id: number }): Promise<IUserDto> => {
		const response = await axios.get<IUserDto>(`/users/get`, {
			params: { id: id },
		});

		return response.data;
	};

	getCurrent = async (): Promise<IAuthenticatedUserDto> => {
		const response = await axios.get<IAuthenticatedUserDto>(
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
	}): Promise<ISearchResultDto<IUserDto>> => {
		const response = await axios.get<ISearchResultDto<IUserDto>>(
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
	}): Promise<IAuthenticatedUserDto> => {
		const response = await axios.post<IAuthenticatedUserDto>(
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
