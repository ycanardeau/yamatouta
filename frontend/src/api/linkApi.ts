import axios from 'axios';

import { ILinkTypeObject } from '../dto/ILinkTypeObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { EntryType } from '../models/EntryType';

class LinkApi {
	getType = async ({ id }: { id: number }): Promise<ILinkTypeObject> => {
		const response = await axios.get<ILinkTypeObject>(`/links/get-type`, {
			params: { id: id },
		});

		return response.data;
	};

	listTypes = async ({
		entryType,
		relatedEntryType,
	}: {
		entryType?: EntryType;
		relatedEntryType?: EntryType;
	}): Promise<ISearchResultObject<ILinkTypeObject>> => {
		const response = await axios.get<ISearchResultObject<ILinkTypeObject>>(
			'/links/list-types',
			{ params: { entryType, relatedEntryType } },
		);

		return response.data;
	};
}

export const linkApi = new LinkApi();
