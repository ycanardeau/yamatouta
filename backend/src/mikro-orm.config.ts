import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';

import config from './config';

const logger = new Logger('MikroORM');
const options: Options = {
	type: config.db.connection,
	dbName: config.db.database,
	debug: config.db.debug,
	user: config.db.username,
	password: config.db.password,
	entities: ['./dist/entities/**/*.js'],
	entitiesTs: ['./src/entities/**/*.ts'],
	highlighter: new SqlHighlighter(),
	migrations: {
		path: './src/migrations',
		disableForeignKeys: false,
	},
	logger: logger.log.bind(logger),
	metadataProvider: TsMorphMetadataProvider,
	forceUndefined: true,
	forceUtcTimezone: true,
	allowGlobalContext: process.env.NODE_ENV === 'test',
};

export default options;
