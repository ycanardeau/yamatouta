import axios from 'axios';

import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ITranslationObject } from '../dto/ITranslationObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { TranslationOptionalField } from '../models/TranslationOptionalField';
import { TranslationSortRule } from '../models/TranslationSortRule';
import { WordCategory } from '../models/WordCategory';
import { IPaginationParams } from '../stores/PaginationStore';

class TranslationApi {
	create = async ({
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
	}: {
		headword: string;
		locale: string;
		reading: string;
		yamatokotoba: string;
		category: WordCategory;
		webLinks: IWebLinkObject[];
	}): Promise<ITranslationObject> => {
		const response = await axios.post<ITranslationObject>(
			'/translations/create',
			{
				id: 0,
				headword,
				locale,
				reading,
				yamatokotoba,
				category,
				webLinks,
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
	}): Promise<ITranslationObject> => {
		const response = await axios.get<ITranslationObject>(
			`/translations/get`,
			{ params: { id: id, fields: fields } },
		);

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
	}): Promise<ISearchResultObject<ITranslationObject>> => {
		const response = await axios.get<
			ISearchResultObject<ITranslationObject>
		>('/translations/list', {
			params: {
				...pagination,
				sort: sort,
				query: query,
				category: category,
			},
		});

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultObject<IRevisionObject>> => {
		const response = await axios.get<ISearchResultObject<IRevisionObject>>(
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
	}: {
		id: number;
		headword: string;
		locale: string;
		reading: string;
		yamatokotoba: string;
		category: WordCategory;
		webLinks: IWebLinkObject[];
	}): Promise<ITranslationObject> => {
		const response = await axios.post<ITranslationObject>(
			`/translations/update`,
			{
				id: id,
				headword,
				locale,
				reading,
				yamatokotoba,
				category,
				webLinks,
			},
		);

		return response.data;
	};
}

export const translationApi = new TranslationApi();
