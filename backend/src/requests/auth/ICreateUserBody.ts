import Joi, { ObjectSchema } from 'joi';

export interface ICreateUserBody {
	username: string;
	email: string;
	password: string;
}

export const createUserBodySchema: ObjectSchema<ICreateUserBody> = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().required(),
	password: Joi.string().required(),
});
