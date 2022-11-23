import Joi from 'joi';

interface IConfig {
	apiEndpoint: string;
	disableAccountCreation: boolean;
}

const schema = Joi.object<IConfig>({
	apiEndpoint: Joi.string().required(),
	disableAccountCreation: Joi.boolean().required(),
});

const config = ((): IConfig => {
	const value = {
		apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
		disableAccountCreation: import.meta.env.VITE_DISABLE_ACCOUNT_CREATION,
	};

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export default config;
