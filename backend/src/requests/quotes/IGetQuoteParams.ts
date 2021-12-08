export interface IGetQuoteParams {
	quoteId: number;
}

export const getQuoteParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		quoteId: {
			type: 'number',
		},
	},
	required: ['quoteId'],
	type: 'object',
};
