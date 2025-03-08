import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IUserDto } from '@/dto/IUserDto';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface IUserApiClientProvider {
	create(request: {
		email: string;
		username: string;
		password: string;
	}): Promise<IAuthenticatedUserDto>;
	get(request: { id: number }): Promise<IUserDto>;
	getCurrent(): Promise<IAuthenticatedUserDto>;
	list(request: {
		pagination: IPaginationParams;
		sort?: UserSortRule;
		query?: string;
		userGroup?: UserGroup;
	}): Promise<ISearchResultDto<IUserDto>>;
	update(request: {
		password: string;
		email?: string;
		username?: string;
		newPassword?: string;
	}): Promise<IAuthenticatedUserDto>;
}
