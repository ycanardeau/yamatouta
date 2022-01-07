import axios from 'axios';

import config from '../config';
import { ITranslationObject } from '../dto/translations/ITranslationObject';

export const createTranslation = async (params: {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
}): Promise<ITranslationObject> => {
	const { headword, locale, reading, yamatokotoba } = params;

	const response = await axios.post<ITranslationObject>(
		`${config.apiEndpoint}/translations`,
		{
			headword: headword,
			locale: locale,
			reading: reading,
			yamatokotoba: yamatokotoba,
		},
	);

	return response.data;
};
