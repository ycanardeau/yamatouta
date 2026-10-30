import { IUserApi } from '@/api/IUserApi';
import { IUserRow, findById, loadCollection } from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	matchesQuery,
	paginate,
	readOnly,
	thenBy,
} from '@/api/json/queryUtils';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IUserDto } from '@/dto/IUserDto';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { IPaginationParams } from '@/stores/PaginationStore';

type Row = IUserRow;

const bySortRule = (sort?: UserSortRule): Comparer<Row> => {
	switch (sort) {
		case UserSortRule.NameAsc:
			return thenBy(
				by((u) => u.name, 'asc'),
				by((u) => u.id, 'asc'),
			);

		case UserSortRule.NameDesc:
			return thenBy(
				by((u) => u.name, 'desc'),
				by((u) => u.id, 'desc'),
			);

		case UserSortRule.CreatedAsc:
		case undefined:
			return thenBy(
				by((u) => u.createdAt, 'asc'),
				by((u) => u.id, 'asc'),
			);

		case UserSortRule.CreatedDesc:
			return thenBy(
				by((u) => u.createdAt, 'desc'),
				by((u) => u.id, 'desc'),
			);
	}
};

const toDto = (row: Row): IUserDto => ({
	id: row.id,
	entryType: row.entryType,
	name: row.name,
	avatarUrl: row.avatarUrl,
});

export class JsonUserApi implements IUserApi {
	create = readOnly;

	get = async ({ id }: { id: number }): Promise<IUserDto> => {
		return toDto(await findById('users', id));
	};

	getCurrent = readOnly;

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
		const users = await loadCollection('users');

		const items = users
			.filter(
				(u) =>
					(!userGroup || u.userGroup === userGroup) &&
					matchesQuery([u.name], query),
			)
			.sort(bySortRule(sort));

		const result = paginate(items, pagination);

		return { ...result, items: result.items.map(toDto) };
	};

	update = readOnly;
}
