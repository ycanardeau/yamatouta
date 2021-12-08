import { Configuration, Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');
const config: Options = {
	type: process.env.DB_CONNECTION as keyof typeof Configuration.PLATFORMS,
	dbName: process.env.DB_DATABASE,
	debug: process.env.DB_DEBUG === 'true',
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	entities: ['./dist/entities/**/*.js'],
	entitiesTs: ['./src/entities/**/*.ts'],
	highlighter: new SqlHighlighter(),
	migrations: {
		path: './src/migrations',
		disableForeignKeys: false,
	},
	logger: logger.log.bind(logger),
	metadataProvider: TsMorphMetadataProvider,
};

export default config;
