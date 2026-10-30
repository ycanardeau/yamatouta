import { IUserApi } from '@/api/IUserApi';
import { HttpUserApi } from '@/api/http/HttpUserApi';
import { JsonUserApi } from '@/api/json/JsonUserApi';
import config from '@/config';

export const userApi: IUserApi =
	config.dataSource === 'json' ? new JsonUserApi() : new HttpUserApi();
