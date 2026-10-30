import { IQuoteApi } from '@/api/IQuoteApi';
import { HttpQuoteApi } from '@/api/http/HttpQuoteApi';
import { JsonQuoteApi } from '@/api/json/JsonQuoteApi';
import config from '@/config';

export const quoteApi: IQuoteApi =
	config.dataSource === 'json' ? new JsonQuoteApi() : new HttpQuoteApi();
