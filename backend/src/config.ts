import { Configuration } from '@mikro-orm/core';
import Joi from 'joi';

interface IConfig {
	port: number;
	disableAccountCreation: boolean;
	cors: {
		allowedOrigins: string[];
	};
	db: {
		connection: keyof typeof Configuration.PLATFORMS;
		database: string;
		debug: boolean;
		username: string;
		password: string;
	};
	session: {
		secret: string;
	};
	cookie: {
		domain: string;
	};
}

const schema: Joi.ObjectSchema<IConfig> = Joi.object({
	port: Joi.number().required(),
	disableAccountCreation: Joi.boolean().required(),
	cors: {
		allowedOrigins: Joi.array().items(Joi.string().required()),
	},
	db: {
		connection: Joi.string()
			.required()
			.valid(...Object.keys(Configuration.PLATFORMS)),
		database: Joi.string().required(),
		debug: Joi.boolean().required(),
		username: Joi.string().required(),
		password: Joi.string().required(),
	},
	session: {
		secret: Joi.string().required().trim(),
	},
	cookie: {
		domain: Joi.string().required().allow(''),
	},
});

const config = ((): IConfig => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const value = require(`../appsettings.${process.env.NODE_ENV}`);

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export default config;
