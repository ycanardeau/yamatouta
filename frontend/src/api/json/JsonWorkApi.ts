import { IWorkApi } from '@/api/IWorkApi';
import { IWorkRow, findById, loadCollection } from '@/api/json/jsonDatabase';
import {
	Comparer,
	by,
	emptyResult,
	matchesQuery,
	paginate,
	readOnly,
	thenBy,
} from '@/api/json/queryUtils';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import { IPaginationParams } from '@/stores/PaginationStore';

type Row = IWorkRow;

const bySortRule = (sort?: WorkSortRule): Comparer<Row> => {
	switch (sort) {
		case WorkSortRule.NameAsc:
			return thenBy(
				by((w) => w.name, 'asc'),
				by((w) => w.id, 'asc'),
			);

		case WorkSortRule.NameDesc:
			return thenBy(
				by((w) => w.name, 'desc'),
				by((w) => w.id, 'desc'),
			);

		case WorkSortRule.CreatedAsc:
		case undefined:
			return thenBy(
				by((w) => w.createdAt, 'asc'),
				by((w) => w.id, 'asc'),
			);

		case WorkSortRule.CreatedDesc:
			return thenBy(
				by((w) => w.createdAt, 'desc'),
				by((w) => w.id, 'desc'),
			);

		case WorkSortRule.UpdatedAsc:
			return thenBy(
				by((w) => w.updatedAt, 'asc'),
				by((w) => w.id, 'asc'),
			);

		case WorkSortRule.UpdatedDesc:
			return thenBy(
				by((w) => w.updatedAt, 'desc'),
				by((w) => w.id, 'desc'),
			);
	}
};

const toDto = (row: Row, fields?: WorkOptionalField[]): IWorkDto => ({
	id: row.id,
	entryType: row.entryType,
	name: row.name,
	workType: row.workType,
	webLinks: fields?.includes(WorkOptionalField.WebLinks)
		? row.webLinks ?? []
		: undefined,
	artistLinks: fields?.includes(WorkOptionalField.ArtistLinks)
		? row.artistLinks ?? []
		: undefined,
});

export class JsonWorkApi implements IWorkApi {
	create = readOnly;

	delete = readOnly;

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: WorkOptionalField[];
	}): Promise<IWorkDto> => {
		return toDto(await findById('works', id), fields);
	};

	list = async ({
		pagination,
		sort,
		query,
		workType,
	}: {
		pagination: IPaginationParams;
		sort?: WorkSortRule;
		query?: string;
		workType?: WorkType;
	}): Promise<ISearchResultDto<IWorkDto>> => {
		const works = await loadCollection('works');

		const items = works
			.filter(
				(w) =>
					(!workType || w.workType === workType) &&
					matchesQuery([w.name], query),
			)
			.sort(bySortRule(sort));

		const result = paginate(items, pagination);

		return { ...result, items: result.items.map((w) => toDto(w)) };
	};

	listRevisions = async (): Promise<ISearchResultDto<IRevisionDto>> =>
		emptyResult();

	update = readOnly;
}
