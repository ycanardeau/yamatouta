import { BadRequestException } from '@nestjs/common';

import { UserAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { User } from '../../../src/entities/User';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { PasswordHasherFactory } from '../../../src/services/passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from '../../../src/services/users/NormalizeEmailService';
import { UpdateAuthenticatedUserService } from '../../../src/services/users/UpdateAuthenticatedUserService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createUser } from '../../createEntry';
import { testUserAuditLogEntry } from '../../testAuditLogEntry';

describe('UpdateAuthenticatedUserService', () => {
	const existingUsername = 'user';
	const existingEmail = 'user@example.com';
	const existingPassword = 'P@$$w0rd';

	let normalizeEmailService: NormalizeEmailService;
	let normalizedEmail: string;
	let salt: string;
	let passwordHash: string;
	let existingUser: User;
	let permissionContext: FakePermissionContext;
	let em: FakeEntityManager;
	let updateAuthenticatedUserService: UpdateAuthenticatedUserService;

	beforeEach(async () => {
		const passwordHasherFactory = new PasswordHasherFactory();
		const passwordHasher = passwordHasherFactory.default;

		normalizeEmailService = new NormalizeEmailService();

		normalizedEmail = await normalizeEmailService.normalizeEmail(
			existingEmail,
		);
		salt = await passwordHasher.generateSalt();
		passwordHash = await passwordHasher.hashPassword(
			existingPassword,
			salt,
		);

		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
		});
		existingUser.salt = salt;
		existingUser.passwordHash = passwordHash;

		permissionContext = new FakePermissionContext(existingUser);
		em = new FakeEntityManager();
		const userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
		};
		const auditLogService = new AuditLogService(em as any);

		updateAuthenticatedUserService = new UpdateAuthenticatedUserService(
			permissionContext,
			em as any,
			userRepo as any,
			passwordHasherFactory,
			normalizeEmailService,
			auditLogService,
		);
	});

	describe('updateAuthenticatedUser', () => {
		test('username', async () => {
			const newUsername = 'new username';

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: 'wrong password',
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: newUsername,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(newUsername);

			expect(existingUser.name).toBe(newUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('username is not changed', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: existingUsername,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('minimum username length', async () => {
			const newUsername = 'ab';

			expect(newUsername.length).toBe(2);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: newUsername,
				});

			expect(userObject.name).toBe(newUsername);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('maximum username length', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(newUsername.length).toBe(32);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: newUsername,
				});

			expect(userObject.name).toBe(newUsername);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Rename,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: existingUsername,
				newValue: newUsername,
				user: existingUser,
			});
		});

		test('username is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: undefined,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: '',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is whitespace', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is too short', async () => {
			const newUsername = 'い';

			expect(newUsername.length).toBe(1);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is too long', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(newUsername.length).toBe(33);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email', async () => {
			const newEmail = 'new_email@example.com';
			const newNormalizedEmail =
				await normalizeEmailService.normalizeEmail(newEmail);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: 'wrong password',
					email: newEmail,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					email: newEmail,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(newEmail);
			expect(existingUser.normalizedEmail).toBe(newNormalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_ChangeEmail,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: existingEmail,
				newValue: newEmail,
				user: existingUser,
			});
		});

		test('email is not changed', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					email: existingEmail,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					email: undefined,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					email: '',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is invalid', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('newPassword', async () => {
			const newPassword = 'N3wP@$$w0rd';

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: 'wrong password',
					newPassword: newPassword,
				}),
			).rejects.toThrow(BadRequestException);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					newPassword: newPassword,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).not.toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_ChangePassword,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('newPassword is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					newPassword: undefined,
				});

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUsername);

			expect(existingUser.name).toBe(existingUsername);
			expect(existingUser.email).toBe(existingEmail);
			expect(existingUser.normalizedEmail).toBe(normalizedEmail);
			expect(existingUser.salt).toBe(salt);
			expect(existingUser.passwordHash).toBe(passwordHash);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('newPassword is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					newPassword: '',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('newPassword is too short', async () => {
			const newPassword = 'P@$$w0r';

			expect(newPassword.length).toBe(7);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: existingPassword,
					newPassword: newPassword,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});
	});
});
