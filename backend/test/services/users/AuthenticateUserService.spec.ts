import { AuthenticatedUserObject } from '../../../src/dto/users/AuthenticatedUserObject';
import { User } from '../../../src/entities/User';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { PasswordHasherFactory } from '../../../src/services/passwordHashers/PasswordHasherFactory';
import {
	AuthenticateUserService,
	LoginError,
} from '../../../src/services/users/AuthenticateUserService';
import { NormalizeEmailService } from '../../../src/services/users/NormalizeEmailService';

describe('AuthenticateUserService', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';
	const existingPassword = 'P@$$w0rd';

	let normalizeEmailService: NormalizeEmailService;
	let normalizedExistingEmail: string;
	let salt: string;
	let passwordHash: string;
	let user: User;
	let authenticateUserService: AuthenticateUserService;

	beforeEach(async () => {
		const passwordHasherFactory = new PasswordHasherFactory();
		const passwordHasher = passwordHasherFactory.default;

		normalizeEmailService = new NormalizeEmailService();

		normalizedExistingEmail = await normalizeEmailService.normalizeEmail(
			existingEmail,
		);
		salt = await passwordHasher.generateSalt();
		passwordHash = await passwordHasher.hashPassword(
			existingPassword,
			salt,
		);

		user = new User({
			name: existingUsername,
			email: existingEmail,
			normalizedEmail: normalizedExistingEmail,
			passwordHashAlgorithm: passwordHasher.algorithm,
			salt: salt,
			passwordHash: passwordHash,
		});
		user.id = 1;

		const em = {
			transactional: (
				cb: () => Promise<AuthenticatedUserObject>,
			): Promise<AuthenticatedUserObject> => {
				return cb();
			},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			persist: (): void => {},
		};
		const userRepo = {
			findOne: async (where: any): Promise<User> =>
				[user].filter((u) => u.email === where.email)[0],
		};
		const auditLogService = new AuditLogService(em as any);

		authenticateUserService = new AuthenticateUserService(
			em as any,
			userRepo as any,
			auditLogService,
			passwordHasherFactory,
		);
	});

	describe('authenticateUser', () => {
		const defaultParams = {
			email: existingEmail,
			password: existingPassword,
			ip: '::1',
		};

		test('authenticateUser', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
			});

			expect(result.error).toBe(LoginError.None);
			expect(result.user).toBeDefined();

			if (!result.user) throw new Error();

			const userObject = result.user;

			expect(userObject.id).toBe(user.id);
			expect(userObject.name).toBe(user.name);
		});

		test('email is undefined', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				email: undefined!,
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();
		});

		test('email is empty', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				email: '',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();
		});

		test('email is whitespace', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				email: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();
		});

		test('email is invalid', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				email: 'invalid_email',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();
		});

		test('email does not exist', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				email: 'not_found@example.com',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();
		});

		test('password is undefined', async () => {
			await expect(
				authenticateUserService.authenticateUser({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrowError('data and salt arguments required');
		});

		test('password is empty', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				password: '',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();
		});

		test('password is whitespace', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				password: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();
		});

		test('password is wrong', async () => {
			const result = await authenticateUserService.authenticateUser({
				...defaultParams,
				password: 'wrong_password',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();
		});
	});
});
