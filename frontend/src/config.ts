import Joi from 'joi';

interface IConfig {
	apiEndpoint: string;
	disableAccountCreation: boolean;
	discordInvitationLink?: string;
}

const schema = Joi.object<IConfig>({
	apiEndpoint: Joi.string().required(),
	disableAccountCreation: Joi.boolean().required(),
	discordInvitationLink: Joi.string().optional(),
});

const config = ((): IConfig => {
	const value = {
		apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
		disableAccountCreation: import.meta.env.VITE_DISABLE_ACCOUNT_CREATION,
		discordInvitationLink: import.meta.env.VITE_DISCORD_INVITATION_LINK,
	};

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export default config;
