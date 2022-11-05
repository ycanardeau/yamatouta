import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { User } from '@/entities/User';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { createApplication } from 'test/createApplication';
import { createUser } from 'test/createEntry';

describe('AuthenticatedUserDto', () => {
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
		const userDto = AuthenticatedUserDto.create(user);
		expect(userDto.id).toBe(user.id);
		expect(userDto.avatarUrl).not.toBe(user.email);
	});
});
