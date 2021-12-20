import Joi from 'joi';

interface IConfig {
	apiEndpoint: string;
	gaMeasurementId: string;
}

const schema: Joi.ObjectSchema<IConfig> = Joi.object({
	apiEndpoint: Joi.string().required(),
	gaMeasurementId: Joi.string().allow(''),
});

const config = ((): IConfig => {
	const value = {
		apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
		gaMeasurementId: process.env.REACT_APP_GA_MEASUREMENT_ID,
	};

	const result = schema.validate(value, { convert: true });

	if (result.value) return result.value;

	throw new Error(result.error.details[0].message);
})();

export default config;
