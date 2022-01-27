import Joi from 'joi';

export interface IUpdateAuthenticatedUserBody {
	password: string;
	email?: string;
	newPassword?: string;
}

export const updateAuthenticatedUserBodySchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().optional(),
	newPassword: Joi.string().optional(),
});
