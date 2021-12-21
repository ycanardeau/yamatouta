import Joi from 'joi';

interface IConfig {
	apiEndpoint: string;
	gaMeasurementId: string;
	disableAccountCreation: boolean;
}

const schema: Joi.ObjectSchema<IConfig> = Joi.object({
	apiEndpoint: Joi.string().required(),
	gaMeasurementId: Joi.string().allow(''),
	disableAccountCreation: Joi.boolean().required(),
});

const config = ((): IConfig => {
	const value = {
		apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
		gaMeasurementId: process.env.REACT_APP_GA_MEASUREMENT_ID,
		disableAccountCreation: process.env.REACT_APP_DISABLE_ACCOUNT_CREATION,
	};

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export default config;
