import { BadRequestException } from '@nestjs/common';

import { User } from '../../../src/entities/User';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { PasswordHasherFactory } from '../../../src/services/passwordHashers/PasswordHasherFactory';
import { CreateUserService } from '../../../src/services/users/CreateUserService';
import { NormalizeEmailService } from '../../../src/services/users/NormalizeEmailService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';

describe('CreateUserService', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';

	let normalizeEmailService: NormalizeEmailService;
	let normalizedExistingEmail: string;
	let salt: string;
	let passwordHash: string;
	let user: User;
	let createUserService: CreateUserService;

	beforeEach(async () => {
		const passwordHasherFactory = new PasswordHasherFactory();
		const passwordHasher = passwordHasherFactory.default;

		normalizeEmailService = new NormalizeEmailService();

		normalizedExistingEmail = await normalizeEmailService.normalizeEmail(
			existingEmail,
		);
		salt = await passwordHasher.generateSalt();
		passwordHash = await passwordHasher.hashPassword('P@$$w0rd', salt);

		user = new User({
			name: existingUsername,
			email: existingEmail,
			normalizedEmail: normalizedExistingEmail,
			passwordHashAlgorithm: passwordHasher.algorithm,
			salt: salt,
			passwordHash: passwordHash,
		});
		user.id = 1;

		const em = new FakeEntityManager();
		const userRepo = {
			findOne: async (where: any): Promise<User> =>
				[user].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			persist: (): void => {},
		};
		const auditLogService = new AuditLogService(em as any);
		const permissionContext = new FakePermissionContext(user);

		createUserService = new CreateUserService(
			em as any,
			userRepo as any,
			auditLogService,
			normalizeEmailService,
			passwordHasherFactory,
			permissionContext,
		);
	});

	describe('createUser', () => {
		const defaultParams = {
			username: 'user',
			email: 'user@example.com',
			password: 'P@$$w0rd',
		};

		test('createUser', async () => {
			const userObject = await createUserService.createUser({
				...defaultParams,
			});

			expect(userObject.name).toBe(defaultParams.username);
		});

		test('minimum username length', async () => {
			const username = 'ab';

			expect(username.length).toBe(2);

			const userObject = await createUserService.createUser({
				...defaultParams,
				username: username,
			});

			expect(userObject.name).toBe(username);
		});

		test('maximum username length', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(username.length).toBe(32);

			const userObject = await createUserService.createUser({
				...defaultParams,
				username: username,
			});

			expect(userObject.name).toBe(username);
		});

		test('username is undefined', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					username: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is empty', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					username: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is whitespace', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is too short', async () => {
			const username = 'い';

			expect(username.length).toBe(1);

			await expect(
				createUserService.createUser({
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('username is too long', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(username.length).toBe(33);

			await expect(
				createUserService.createUser({
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('email is existing', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					email: existingEmail,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('email is undefined', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					email: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('email is empty', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					email: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('email is invalid', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('password is undefined', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('password is empty', async () => {
			await expect(
				createUserService.createUser({
					...defaultParams,
					password: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('password is too short', async () => {
			const password = 'P@$$w0r';

			expect(password.length).toBe(7);

			await expect(
				createUserService.createUser({
					...defaultParams,
					password: password,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
