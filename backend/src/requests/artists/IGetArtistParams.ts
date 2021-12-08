export interface IGetArtistParams {
	artistId: number;
}

export const getArtistParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		artistId: {
			type: 'number',
		},
	},
	required: ['artistId'],
	type: 'object',
};
