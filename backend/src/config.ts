import { Configuration } from '@mikro-orm/core';
import Joi from 'joi';
import { resolve } from 'path';

interface IConfig {
	readonly port: number;
	readonly disableAccountCreation: boolean;
	readonly clientBuildPath: string;
	readonly cors: {
		readonly allowedOrigins: string[];
	};
	readonly db: {
		readonly connection: keyof typeof Configuration.PLATFORMS;
		readonly database: string;
		readonly debug: boolean;
		readonly username: string;
		readonly password: string;
	};
	readonly session: {
		readonly secret: string;
	};
	readonly cookie: {
		readonly domain: string;
	};
}

const schema = Joi.object<IConfig>({
	port: Joi.number().required(),
	disableAccountCreation: Joi.boolean().required(),
	clientBuildPath: Joi.string().required(),
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

	if (!result.value) throw new Error(result.error.details[0].message);

	return {
		...result.value,
		clientBuildPath: resolve(process.cwd(), result.value.clientBuildPath),
	};
})();

export default config;
