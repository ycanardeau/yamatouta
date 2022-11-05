import { UserDto } from '@/dto/UserDto';
import { User } from '@/entities/User';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { createApplication } from 'test/createApplication';
import { createUser } from 'test/createEntry';

describe('UserDto', () => {
	let app: INestApplication;
	let em: EntityManager;
	let user: User;
	let deletedUser: User;
	let hiddenUser: User;
	let permissionContext: FakePermissionContext;

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

		deletedUser = await createUser(em as any, {
			username: 'deleted',
			email: 'deleted@example.com',
			deleted: true,
		});

		hiddenUser = await createUser(em as any, {
			username: 'hidden',
			email: 'deleted@example.com',
			hidden: true,
		});

		const viewer = await createUser(em as any, {
			username: 'viewer',
			email: 'viewer@example.com',
		});

		permissionContext = new FakePermissionContext(viewer);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('create', () => {
		const userDto = UserDto.create(permissionContext, user);
		expect(userDto.id).toBe(user.id);
		expect(userDto.name).toBe(user.name);
		expect(userDto.avatarUrl).not.toBe(user.email);

		expect(() => UserDto.create(permissionContext, deletedUser)).toThrow(
			NotFoundException,
		);

		expect(() => UserDto.create(permissionContext, hiddenUser)).toThrow(
			NotFoundException,
		);
	});
});
