import { EntityManager, MikroORM } from '@mikro-orm/core';
import { BadRequestException, INestApplication } from '@nestjs/common';

import {
	UpdateAuthenticatedUserCommand,
	UpdateAuthenticatedUserCommandHandler,
	UpdateAuthenticatedUserParams,
} from '../../../../src/database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { AuthenticatedUserObject } from '../../../../src/dto/users/AuthenticatedUserObject';
import { UserAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { normalizeEmail } from '../../../../src/utils/normalizeEmail';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertUserAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createUser } from '../../../createEntry';

describe('UpdateAuthenticatedUserCommandHandler', () => {
	const existingUsername = 'user';
	const existingEmail = 'user@example.com';
	const existingPassword = 'P@$$w0rd';

	let app: INestApplication;
	let normalizedEmail: string;
	let salt: string;
	let passwordHash: string;
	let existingUser: User;
	let permissionContext: FakePermissionContext;
	let em: EntityManager;
	let updateAuthenticatedUserCommandHandler: UpdateAuthenticatedUserCommandHandler;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		existingUser = await createUser(em, {
			username: existingUsername,
			email: existingEmail,
		});

		normalizedEmail = existingUser.normalizedEmail;
		salt = existingUser.salt;
		passwordHash = existingUser.passwordHash;

		permissionContext = new FakePermissionContext(existingUser);

		updateAuthenticatedUserCommandHandler = app.get(
			UpdateAuthenticatedUserCommandHandler,
		);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('updateAuthenticatedUser', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateAuthenticatedUserParams,
		): Promise<AuthenticatedUserObject> => {
			return updateAuthenticatedUserCommandHandler.execute(
				new UpdateAuthenticatedUserCommand(permissionContext, params),
			);
		};

		test('username', async () => {
			const newUsername = 'new username';

			await expect(
				execute(permissionContext, {
					password: 'wrong password',
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject = await execute(permissionContext, {
				password: existingPassword,
				username: newUsername,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(newUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(newUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('username is not changed', async () => {
			const userObject = await execute(permissionContext, {
				password: existingPassword,
				username: existingUsername,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('minimum username length', async () => {
			const newUsername = 'ab';

			expect(newUsername.length).toBe(2);

			const userObject = await execute(permissionContext, {
				password: existingPassword,
				username: newUsername,
			});

			expect(userObject.name).toBe(newUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('maximum username length', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(newUsername.length).toBe(32);

			const userObject = await execute(permissionContext, {
				password: existingPassword,
				username: newUsername,
			});

			expect(userObject.name).toBe(newUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('username is undefined', async () => {
			const userObject = await execute(permissionContext, {
				password: existingPassword,
				username: undefined,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is empty', async () => {
			await expect(
				execute(permissionContext, {
					password: existingPassword,
					username: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is whitespace', async () => {
			await expect(
				execute(permissionContext, {
					password: existingPassword,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is too short', async () => {
			const newUsername = 'い';

			expect(newUsername.length).toBe(1);

			await expect(
				execute(permissionContext, {
					password: existingPassword,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is too long', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(newUsername.length).toBe(33);

			await expect(
				execute(permissionContext, {
					password: existingPassword,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email', async () => {
			const newEmail = 'new_email@example.com';
			const newNormalizedEmail = await normalizeEmail(newEmail);

			await expect(
				execute(permissionContext, {
					password: 'wrong password',
					email: newEmail,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject = await execute(permissionContext, {
				password: existingPassword,
				email: newEmail,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(newEmail);
			expect(user.normalizedEmail).toBe(newNormalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_ChangeEmail,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: existingEmail,
				newValue: newEmail,
				user: existingUser,
			});
		});

		test('email is not changed', async () => {
			const userObject = await execute(permissionContext, {
				password: existingPassword,
				email: existingEmail,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is undefined', async () => {
			const userObject = await execute(permissionContext, {
				password: existingPassword,
				email: undefined,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is empty', async () => {
			await expect(
				execute(permissionContext, {
					password: existingPassword,
					email: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is invalid', async () => {
			await expect(
				execute(permissionContext, {
					password: existingPassword,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('newPassword', async () => {
			const newPassword = 'N3wP@$$w0rd';

			await expect(
				execute(permissionContext, {
					password: 'wrong password',
					newPassword: newPassword,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject = await execute(permissionContext, {
				password: existingPassword,
				newPassword: newPassword,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).not.toBe(passwordHash);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_ChangePassword,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('newPassword is undefined', async () => {
			const userObject = await execute(permissionContext, {
				password: existingPassword,
				newPassword: undefined,
			});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			expect(user.name).toBe(existingUsername);
			expect(user.email).toBe(existingEmail);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('newPassword is empty', async () => {
			await expect(
				execute(permissionContext, {
					password: existingPassword,
					newPassword: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('newPassword is too short', async () => {
			const newPassword = 'P@$$w0r';

			expect(newPassword.length).toBe(7);

			await expect(
				execute(permissionContext, {
					password: existingPassword,
					newPassword: newPassword,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});
	});
});
