// Code from: https://github.com/ustaxes/UsTaxes/blob/464b66ba507348449fc04bc291707568601a79b0/scripts/setup.ts.
import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone';
import { writeFileSync } from 'fs';
import { createGenerator } from 'ts-json-schema-generator';

const config = {
	path: 'src/models/**/*.ts',
	tsconfig: 'tsconfig.json',
};

const outputPath = 'src/utils/validate-fns.js';

const schema = createGenerator(config).createSchema('*');

const ajv = new Ajv({
	schemas: [schema],
	code: { source: true, esm: true },
	coerceTypes: true,
});

const moduleCode = standaloneCode(ajv, {
	ArtistSearchRouteParams: '#/definitions/ArtistSearchRouteParams',
	HashtagSearchRouteParams: '#/definitions/HashtagSearchRouteParams',
	QuoteSearchRouteParams: '#/definitions/QuoteSearchRouteParams',
	TranslationSearchRouteParams: '#/definitions/TranslationSearchRouteParams',
	UserSearchRouteParams: '#/definitions/UserSearchRouteParams',
	WorkSearchRouteParams: '#/definitions/WorkSearchRouteParams',
});

writeFileSync(outputPath, moduleCode);
