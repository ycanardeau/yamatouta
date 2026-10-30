import Joi from 'joi';

export type DataSource = 'http' | 'json';

interface IConfig {
	// 'http' talks to the backend API; 'json' reads the static JSON files in
	// src/database and makes the site read-only.
	dataSource: DataSource;
	apiEndpoint?: string;
	disableAccountCreation: boolean;
	discordInvitationLink?: string;
}

const schema = Joi.object<IConfig>({
	dataSource: Joi.string().valid('http', 'json').default('http'),
	apiEndpoint: Joi.string().when('dataSource', {
		is: 'http',
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
	disableAccountCreation: Joi.boolean().required(),
	discordInvitationLink: Joi.string().optional(),
});

const config = ((): IConfig => {
	const value = {
		dataSource: import.meta.env.VITE_DATA_SOURCE,
		apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
		disableAccountCreation: import.meta.env.VITE_DISABLE_ACCOUNT_CREATION,
		discordInvitationLink: import.meta.env.VITE_DISCORD_INVITATION_LINK,
	};

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export const isReadOnly = config.dataSource === 'json';

export default config;
