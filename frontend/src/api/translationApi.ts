import { ITranslationApi } from '@/api/ITranslationApi';
import { HttpTranslationApi } from '@/api/http/HttpTranslationApi';
import { JsonTranslationApi } from '@/api/json/JsonTranslationApi';
import config from '@/config';

export const translationApi: ITranslationApi =
	config.dataSource === 'json'
		? new JsonTranslationApi()
		: new HttpTranslationApi();
