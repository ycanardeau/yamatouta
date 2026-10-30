import { IArtistApi } from '@/api/IArtistApi';
import { IArtistRow, findById, loadCollection } from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	emptyResult,
	matchesQuery,
	paginate,
	readOnly,
	thenBy,
} from '@/api/json/queryUtils';
import { IArtistDto } from '@/dto/IArtistDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { IPaginationParams } from '@/stores/PaginationStore';

type Row = IArtistRow;

const bySortRule = (sort?: ArtistSortRule): Comparer<Row> => {
	switch (sort) {
		case ArtistSortRule.NameAsc:
			return thenBy(
				by((a) => a.name, 'asc'),
				by((a) => a.id, 'asc'),
			);

		case ArtistSortRule.NameDesc:
			return thenBy(
				by((a) => a.name, 'desc'),
				by((a) => a.id, 'desc'),
			);

		case ArtistSortRule.CreatedAsc:
		case undefined:
			return thenBy(
				by((a) => a.createdAt, 'asc'),
				by((a) => a.id, 'asc'),
			);

		case ArtistSortRule.CreatedDesc:
			return thenBy(
				by((a) => a.createdAt, 'desc'),
				by((a) => a.id, 'desc'),
			);

		case ArtistSortRule.UpdatedAsc:
			return thenBy(
				by((a) => a.updatedAt, 'asc'),
				by((a) => a.id, 'asc'),
			);

		case ArtistSortRule.UpdatedDesc:
			return thenBy(
				by((a) => a.updatedAt, 'desc'),
				by((a) => a.id, 'desc'),
			);
	}
};

const toDto = (row: Row, fields?: ArtistOptionalField[]): IArtistDto => ({
	id: row.id,
	entryType: row.entryType,
	name: row.name,
	artistType: row.artistType,
	avatarUrl: row.avatarUrl,
	webLinks: fields?.includes(ArtistOptionalField.WebLinks)
		? row.webLinks ?? []
		: undefined,
});

export class JsonArtistApi implements IArtistApi {
	create = readOnly;

	delete = readOnly;

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: ArtistOptionalField[];
	}): Promise<IArtistDto> => {
		return toDto(await findById('artists', id), fields);
	};

	list = async ({
		pagination,
		sort,
		query,
		artistType,
	}: {
		pagination: IPaginationParams;
		sort?: ArtistSortRule;
		query?: string;
		artistType?: ArtistType;
	}): Promise<ISearchResultDto<IArtistDto>> => {
		const artists = await loadCollection('artists');

		const items = artists
			.filter(
				(a) =>
					(!artistType || a.artistType === artistType) &&
					matchesQuery([a.name], query),
			)
			.sort(bySortRule(sort));

		const result = paginate(items, pagination);

		return { ...result, items: result.items.map((a) => toDto(a)) };
	};

	listRevisions = async (): Promise<ISearchResultDto<IRevisionDto>> =>
		emptyResult();

	update = readOnly;
}
