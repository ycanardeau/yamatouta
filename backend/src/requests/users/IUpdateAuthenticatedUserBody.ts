import Joi from 'joi';

export interface IUpdateAuthenticatedUserBody {
	password: string;
	username?: string;
	email?: string;
	newPassword?: string;
}

export const updateAuthenticatedUserBodySchema = Joi.object({
	password: Joi.string().required(),
	username: Joi.string().optional(),
	email: Joi.string().optional(),
	newPassword: Joi.string().optional(),
});
