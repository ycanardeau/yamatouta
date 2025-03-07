import Ajv from 'ajv';

export const ajv = new Ajv({
	code: { source: true, esm: true },
	coerceTypes: true,
});
