import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { ITranslationUpdateParams } from '@/models/translations/ITranslationUpdateParams';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class TranslationApi {
	create = async ({
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
		workLinks,
	}: ITranslationUpdateParams): Promise<ITranslationDto> => {
		const response = await axios.post<ITranslationDto>(
			'/translations/create',
			{
				id: 0,
				headword,
				locale,
				reading,
				yamatokotoba,
				category,
				webLinks,
				workLinks,
			},
		);

		return response.data;
	};

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: TranslationOptionalField[];
	}): Promise<ITranslationDto> => {
		const response = await axios.get<ITranslationDto>(`/translations/get`, {
			params: { id: id, fields: fields },
		});

		return response.data;
	};

	delete = async ({ id }: { id: number }): Promise<void> => {
		await axios.delete<void>(`/translations/delete`, {
			data: { id: id },
		});
	};

	list = async ({
		pagination,
		sort,
		query,
		category,
	}: {
		pagination: IPaginationParams;
		sort?: TranslationSortRule;
		query?: string;
		category?: WordCategory;
	}): Promise<ISearchResultDto<ITranslationDto>> => {
		const response = await axios.get<ISearchResultDto<ITranslationDto>>(
			'/translations/list',
			{
				params: {
					...pagination,
					sort: sort,
					query: query,
					category: category,
				},
			},
		);

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> => {
		const response = await axios.get<ISearchResultDto<IRevisionDto>>(
			`/translations/list-revisions`,
			{ params: { id: id } },
		);

		return response.data;
	};

	update = async ({
		id,
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
		workLinks,
	}: ITranslationUpdateParams): Promise<ITranslationDto> => {
		const response = await axios.post<ITranslationDto>(
			`/translations/update`,
			{
				id: id,
				headword,
				locale,
				reading,
				yamatokotoba,
				category,
				webLinks,
				workLinks,
			},
		);

		return response.data;
	};
}

export const translationApi = new TranslationApi();
