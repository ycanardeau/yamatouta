import { BadRequestException } from '@nestjs/common';

import { User } from '../../../src/entities/User';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { PasswordHasherFactory } from '../../../src/services/passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from '../../../src/services/users/NormalizeEmailService';
import { UpdateAuthenticatedUserService } from '../../../src/services/users/UpdateAuthenticatedUserService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';

describe('UpdateAuthenticatedUserService', () => {
	const username = 'user';
	const email = 'user@example.com';
	const password = 'P@$$w0rd';

	let normalizeEmailService: NormalizeEmailService;
	let normalizedEmail: string;
	let salt: string;
	let passwordHash: string;
	let user: User;
	let updateAuthenticatedUserService: UpdateAuthenticatedUserService;

	beforeEach(async () => {
		const passwordHasherFactory = new PasswordHasherFactory();
		const passwordHasher = passwordHasherFactory.default;

		normalizeEmailService = new NormalizeEmailService();

		normalizedEmail = await normalizeEmailService.normalizeEmail(email);
		salt = await passwordHasher.generateSalt();
		passwordHash = await passwordHasher.hashPassword(password, salt);

		user = new User({
			name: username,
			email: email,
			normalizedEmail: normalizedEmail,
			passwordHashAlgorithm: passwordHasher.algorithm,
			salt: salt,
			passwordHash: passwordHash,
		});
		user.id = 1;

		const permissionContext = new FakePermissionContext(user);
		const em = new FakeEntityManager();
		const userRepo = {
			findOneOrFail: async (): Promise<User> => user,
			findOne: async (where: any): Promise<User> =>
				[user].filter(
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
					password: password,
					username: newUsername,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(newUsername);

			expect(user.name).toBe(newUsername);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('username is not changed', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: username,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('minimum username length', async () => {
			const newUsername = 'ab';

			expect(newUsername.length).toBe(2);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: newUsername,
				});

			expect(userObject.name).toBe(newUsername);
		});

		test('maximum username length', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(newUsername.length).toBe(32);

			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: newUsername,
				});

			expect(userObject.name).toBe(newUsername);
		});

		test('username is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: undefined,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('username is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is whitespace', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is too short', async () => {
			const newUsername = 'い';

			expect(newUsername.length).toBe(1);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is too long', async () => {
			const newUsername =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(newUsername.length).toBe(33);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					username: newUsername,
				}),
			).rejects.toThrow(BadRequestException);
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
					password: password,
					email: newEmail,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(newEmail);
			expect(user.normalizedEmail).toBe(newNormalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('email is not changed', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					email: email,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('email is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					email: undefined,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('email is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					email: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('email is invalid', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);
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
					password: password,
					newPassword: newPassword,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).not.toBe(passwordHash);
		});

		test('newPassword is undefined', async () => {
			const userObject =
				await updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					newPassword: undefined,
				});

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(username);

			expect(user.name).toBe(username);
			expect(user.email).toBe(email);
			expect(user.normalizedEmail).toBe(normalizedEmail);
			expect(user.salt).toBe(salt);
			expect(user.passwordHash).toBe(passwordHash);
		});

		test('newPassword is empty', async () => {
			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					newPassword: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('newPassword is too short', async () => {
			const newPassword = 'P@$$w0r';

			expect(newPassword.length).toBe(7);

			await expect(
				updateAuthenticatedUserService.updateAuthenticatedUser({
					password: password,
					newPassword: newPassword,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
