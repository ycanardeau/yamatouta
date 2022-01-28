import { UnauthorizedException } from '@nestjs/common';
import _ from 'lodash';

import { User } from '../../src/entities/User';
import { Permission } from '../../src/models/Permission';
import { UserGroup } from '../../src/models/UserGroup';
import { userGroupPermissions } from '../../src/models/userGroupPermissions';
import { PasswordHasherFactory } from '../../src/services/passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from '../../src/services/users/NormalizeEmailService';
import { FakePermissionContext } from '../FakePermissionContext';

describe('PermissionContext', () => {
	const createUser = async (params: {
		id: number;
		username: string;
		email: string;
		password: string;
		userGroup: UserGroup;
	}): Promise<User> => {
		const { id, username, email, password, userGroup } = params;

		const passwordHasherFactory = new PasswordHasherFactory();
		const passwordHasher = passwordHasherFactory.default;

		const normalizeEmailService = new NormalizeEmailService();

		const normalizedEmail = await normalizeEmailService.normalizeEmail(
			email,
		);
		const salt = await passwordHasher.generateSalt();
		const passwordHash = await passwordHasher.hashPassword(password, salt);

		const user = new User({
			name: username,
			email: email,
			normalizedEmail: normalizedEmail,
			passwordHashAlgorithm: passwordHasher.algorithm,
			salt: salt,
			passwordHash: passwordHash,
		});
		user.id = id;
		user.userGroup = userGroup;

		return user;
	};

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
