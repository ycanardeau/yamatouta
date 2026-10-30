import { IAdminApi } from '@/api/IAdminApi';
import { HttpAdminApi } from '@/api/http/HttpAdminApi';
import { JsonAdminApi } from '@/api/json/JsonAdminApi';
import config from '@/config';

export const adminApi: IAdminApi =
	config.dataSource === 'json' ? new JsonAdminApi() : new HttpAdminApi();
