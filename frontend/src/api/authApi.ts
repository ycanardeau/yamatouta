import { IAuthApi } from '@/api/IAuthApi';
import { HttpAuthApi } from '@/api/http/HttpAuthApi';
import { JsonAuthApi } from '@/api/json/JsonAuthApi';
import config from '@/config';

export const authApi: IAuthApi =
	config.dataSource === 'json' ? new JsonAuthApi() : new HttpAuthApi();
