import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';

import { Permission } from '../../src/models/Permission';
import { userGroupPermissions } from '../../src/models/userGroupPermissions';
import { UserGroup } from '../../src/models/users/UserGroup';
import { FakePermissionContext } from '../FakePermissionContext';
import { createApplication } from '../createApplication';
import { createUser } from '../createEntry';

describe('PermissionContext', () => {
	let app: INestApplication;
	let em: EntityManager;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	test('hasPermission', async () => {
		const users = await Promise.all([
			createUser(em as any, {
				username: 'limited',
				email: 'limited@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.LimitedUser,
			}),
			createUser(em as any, {
				username: 'user',
				email: 'user@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.User,
			}),
			createUser(em as any, {
				username: 'advanced',
				email: 'advanced@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.AdvancedUser,
			}),
			createUser(em as any, {
				username: 'mod',
				email: 'mod@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Mod,
			}),
			createUser(em as any, {
				username: 'senior',
				email: 'senior@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.SeniorMod,
			}),
			createUser(em as any, {
				username: 'admin',
				email: 'admin@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Admin,
			}),
		]);

		for (const user of users) {
			const allowedPermissions = userGroupPermissions[user.userGroup];
			const disallowedPermissions = _.difference(
				Object.values(Permission),
				allowedPermissions,
			);

			expect(allowedPermissions.length).toBe(
				userGroupPermissions[user.userGroup].length,
			);
			expect(disallowedPermissions.length).toBe(
				Object.values(Permission).length - allowedPermissions.length,
			);

			expect(user.effectivePermissions).toEqual(allowedPermissions);

			const permissionContext = new FakePermissionContext(user);

			for (const permission of allowedPermissions) {
				expect(permissionContext.hasPermission(permission)).toBe(true);

				permissionContext.verifyPermission(permission);
			}

			for (const permission of disallowedPermissions) {
				expect(permissionContext.hasPermission(permission)).toBe(false);

				expect(() =>
					permissionContext.verifyPermission(permission),
				).toThrow(UnauthorizedException);
			}
		}
	});
});
