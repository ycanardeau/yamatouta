import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

export const createApplication = async (): Promise<INestApplication> => {
	const module = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const app = module.createNestApplication();
	await app.init();

	const orm = app.get(MikroORM);
	const generator = orm.getSchemaGenerator();

	await generator.refreshDatabase();

	return app;
};
