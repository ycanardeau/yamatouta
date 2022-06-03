import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, NotFoundException } from '@nestjs/common';

import { UserObject } from '../../src/dto/UserObject';
import { User } from '../../src/entities/User';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createUser } from '../createEntry';

describe('UserObject', () => {
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
		const userObject = UserObject.create(user, permissionContext);
		expect(userObject.id).toBe(user.id);
		expect(userObject.name).toBe(user.name);
		expect(userObject.avatarUrl).toBe(
			`https://www.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af`,
		);
		expect(userObject.avatarUrl).not.toBe(user.email);
		expect(userObject.avatarUrl).not.toBe(
			`https://www.gravatar.com/avatar/${user.email}`,
		);

		expect(() => UserObject.create(deletedUser, permissionContext)).toThrow(
			NotFoundException,
		);

		expect(() => UserObject.create(hiddenUser, permissionContext)).toThrow(
			NotFoundException,
		);
	});
});
