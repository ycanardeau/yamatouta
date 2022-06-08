import { Configuration } from '@mikro-orm/core';
import Joi from 'joi';
import { resolve } from 'path';

interface IConfig {
	readonly port: number;
	readonly disableAccountCreation: boolean;
	readonly clientBuildPath: string;
	readonly gaMeasurementId: string;
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
	readonly contentSecurityPolicy: {
		readonly scriptSrc: string[];
		readonly imgSrc: string[];
		readonly connectSrc: string[];
	};
}

const schema = Joi.object<IConfig>({
	port: Joi.number().required(),
	disableAccountCreation: Joi.boolean().required(),
	clientBuildPath: Joi.string().required(),
	gaMeasurementId: Joi.string().required(),
	cors: Joi.object({
		allowedOrigins: Joi.array().items(Joi.string().required()),
	}),
	db: Joi.object({
		connection: Joi.string()
			.required()
			.valid(...Object.keys(Configuration.PLATFORMS)),
		database: Joi.string().required(),
		debug: Joi.boolean().required(),
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
	session: Joi.object({
		secret: Joi.string().required().trim(),
	}),
	cookie: Joi.object({
		domain: Joi.string().required().allow(''),
	}),
	contentSecurityPolicy: Joi.object({
		scriptSrc: Joi.array().items(Joi.string().required()),
		imgSrc: Joi.array().items(Joi.string().required()),
		connectSrc: Joi.array().items(Joi.string().required()),
	}),
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
