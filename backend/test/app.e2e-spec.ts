import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', () => {
		return (
			request
				// Code from: https://github.com/nestjs/nest/issues/4402#issue-586862546
				.default(app.getHttpServer())
				.get('/')
				.expect(200)
				.expect('Hello World!')
		);
	});
});
