import react from '@vitejs/plugin-react';
import Ajv from 'ajv';
import ajvGenerate from 'ajv/dist/standalone';
import fs from 'fs';
import { join, resolve } from 'path';
import { PluginOption, defineConfig } from 'vite';

const schemas = resolve(__dirname, 'schemas');

// https://github.com/ajv-validator/ajv/issues/406#issuecomment-1015785863
const jsonSchemaValidator = (): PluginOption => {
	return {
		name: 'rollup-plugin-ajv-validator',
		resolveId: (source) =>
			source.indexOf('.jsonschema') === -1 ? null : source,
		load: async (id) => {
			if (id.indexOf('.jsonschema') === -1) return null;

			const schemaFile = id.replace(/\.jsonschema$/, '.schema.json');

			try {
				const schemaPath = join(schemas, schemaFile);
				const schemaJson = await fs.promises.readFile(
					schemaPath,
					'utf8',
				);
				const schema = JSON.parse(schemaJson);

				const ajv = new Ajv({
					code: { source: true, esm: true },
					coerceTypes: true,
				});
				const validator = ajv.compile(schema);
				const sourceOut = ajvGenerate(ajv, validator);

				return sourceOut;
			} catch (ex) {
				console.error(ex);

				return 'export default () => true';
			}
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [react(), jsonSchemaValidator()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
			},
		},
	},
	build: {
		// https://vitejs.dev/guide/backend-integration.html#backend-integration
		manifest: true,
		// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
});
