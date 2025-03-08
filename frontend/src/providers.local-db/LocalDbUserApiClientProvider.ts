import { IAuthenticatedUserDto } from '@/dto/IAuthenticatedUserDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IUserDto } from '@/dto/IUserDto';
import { EntryType } from '@/models/EntryType';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { IUserApiClientProvider } from '@/providers.abstractions/IUserApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbUserApiClientProvider implements IUserApiClientProvider {
	async create({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}): Promise<IAuthenticatedUserDto> {
		throw new Error('Method not implemented.');
	}

	async get({ id }: { id: number }): Promise<IUserDto> {
		return {
			id: 0,
			entryType: EntryType.User,
			name: 'User 1',
			avatarUrl: '',
		};
	}

	async getCurrent(): Promise<IAuthenticatedUserDto> {
		return {
			id: 0,
			entryType: EntryType.User,
			name: 'User 1',
			avatarUrl: '',
			effectivePermissions: [],
			userGroup: UserGroup.User,
		};
	}

	async list({
		pagination,
		sort,
		query,
		userGroup,
	}: {
		pagination: IPaginationParams;
		sort?: UserSortRule;
		query?: string;
		userGroup?: UserGroup;
	}): Promise<ISearchResultDto<IUserDto>> {
		return {
			items: [
				{
					id: 0,
					entryType: EntryType.User,
					name: 'User 1',
					avatarUrl: '',
				},
			],
			totalCount: 1,
		};
	}

	async update({
		password,
		email,
		username,
		newPassword,
	}: {
		password: string;
		email?: string;
		username?: string;
		newPassword?: string;
	}): Promise<IAuthenticatedUserDto> {
		throw new Error('Method not implemented.');
	}
}
