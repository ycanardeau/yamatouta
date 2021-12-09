export interface IGetUserParams {
	userId: number;
}

export const getUserParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		userId: {
			type: 'number',
		},
	},
	required: ['userId'],
	type: 'object',
};
