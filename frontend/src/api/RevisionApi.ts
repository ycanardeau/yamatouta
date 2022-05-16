import axios from 'axios';

import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';

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

export const listWorkRevisions = async ({
	workId,
}: {
	workId: number;
}): Promise<ISearchResultObject<IRevisionObject>> => {
	const response = await axios.get<ISearchResultObject<IRevisionObject>>(
		`/works/${workId}/revisions`,
	);

	return response.data;
};
