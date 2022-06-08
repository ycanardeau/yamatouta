import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../src/dto/AuthenticatedUserObject';
import { User } from '../../src/entities/User';
import { createApplication } from '../createApplication';
import { createUser } from '../createEntry';

describe('AuthenticatedUserObject', () => {
	let app: INestApplication;
	let em: EntityManager;
	let user: User;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		user = await createUser(em as any, {
			username: 'user',
			email: 'user@example.com',
		});
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('create', () => {
		const userObject = AuthenticatedUserObject.create(user);
		expect(userObject.id).toBe(user.id);
		expect(userObject.avatarUrl).not.toBe(user.email);
	});
});
