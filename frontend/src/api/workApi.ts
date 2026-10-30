import { IWorkApi } from '@/api/IWorkApi';
import { HttpWorkApi } from '@/api/http/HttpWorkApi';
import { JsonWorkApi } from '@/api/json/JsonWorkApi';
import config from '@/config';

export const workApi: IWorkApi =
	config.dataSource === 'json' ? new JsonWorkApi() : new HttpWorkApi();
