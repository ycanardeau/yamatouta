import { IHashtagApi } from '@/api/IHashtagApi';
import { HttpHashtagApi } from '@/api/http/HttpHashtagApi';
import { JsonHashtagApi } from '@/api/json/JsonHashtagApi';
import config from '@/config';

export const hashtagApi: IHashtagApi =
	config.dataSource === 'json' ? new JsonHashtagApi() : new HttpHashtagApi();
