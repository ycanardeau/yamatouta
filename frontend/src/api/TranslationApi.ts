import axios from 'axios';

import config from '../config';
import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { WordCategory } from '../models/WordCategory';

export const createTranslation = async (params: {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
	category?: WordCategory;
}): Promise<ITranslationObject> => {
	const { headword, locale, reading, yamatokotoba, category } = params;

	const response = await axios.post<ITranslationObject>(
		`${config.apiEndpoint}/translations`,
		{
			headword: headword,
			locale: locale,
			reading: reading,
			yamatokotoba: yamatokotoba,
			category: category,
		},
	);

	return response.data;
};
