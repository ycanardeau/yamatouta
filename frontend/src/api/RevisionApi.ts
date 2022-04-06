import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IRevisionObject } from '../dto/revisions/IRevisionObject';

export const listTranslationRevisions = async ({
	translationId,
}: {
	translationId: number;
}): Promise<ISearchResultObject<IRevisionObject>> => {
	const response = await axios.get<ISearchResultObject<IRevisionObject>>(
		`/translations/${translationId}/revisions`,
	);

	return response.data;
};

export const listArtistRevisions = async ({
	artistId,
}: {
	artistId: number;
}): Promise<ISearchResultObject<IRevisionObject>> => {
	const response = await axios.get<ISearchResultObject<IRevisionObject>>(
		`/artists/${artistId}/revisions`,
	);

	return response.data;
};

export const listQuoteRevisions = async ({
	quoteId,
}: {
	quoteId: number;
}): Promise<ISearchResultObject<IRevisionObject>> => {
	const response = await axios.get<ISearchResultObject<IRevisionObject>>(
		`/quotes/${quoteId}/revisions`,
	);

	return response.data;
};
