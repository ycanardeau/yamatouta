import { IAuthApi } from '@/api/IAuthApi';
import { readOnly } from '@/api/json/queryUtils';

export class JsonAuthApi implements IAuthApi {
	login = readOnly;

	logout = async (): Promise<void> => {};
}
