import Joi from 'joi';

export interface ICreateTranslationBody {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
}

export const createTranslationBodySchema = Joi.object({
	headword: Joi.string().required().trim(),
	locale: Joi.string().optional().trim().allow(''),
	reading: Joi.string().optional().trim().allow(''),
	yamatokotoba: Joi.string().required().trim(),
});
