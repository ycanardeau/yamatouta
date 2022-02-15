import { UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';

import { Permission } from '../../src/models/Permission';
import { UserGroup } from '../../src/models/UserGroup';
import { userGroupPermissions } from '../../src/models/userGroupPermissions';
import { FakePermissionContext } from '../FakePermissionContext';
import { createUser } from '../createEntry';

describe('PermissionContext', () => {
	test('hasPermission', async () => {
		const users = await Promise.all([
			createUser({
				id: 1,
				username: 'limited',
				email: 'limited@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.LimitedUser,
			}),
			createUser({
				id: 2,
				username: 'user',
				email: 'user@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.User,
			}),
			createUser({
				id: 3,
				username: 'advanced',
				email: 'advanced@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.AdvancedUser,
			}),
			createUser({
				id: 4,
				username: 'mod',
				email: 'mod@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.Mod,
			}),
			createUser({
				id: 5,
				username: 'senior',
				email: 'senior@example.com',
				password: 'P@$$w0rd',
				userGroup: UserGroup.SeniorMod,
			}),
			createUser({
				id: 6,
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
