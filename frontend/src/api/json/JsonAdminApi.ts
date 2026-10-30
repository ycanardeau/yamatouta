import { IAdminApi } from '@/api/IAdminApi';
import { readOnly } from '@/api/json/queryUtils';

export class JsonAdminApi implements IAdminApi {
	createMissingRevisions = readOnly;

	generateSitemaps = readOnly;

	updateSearchIndex = readOnly;
}
