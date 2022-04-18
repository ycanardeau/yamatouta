import { UserAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import {
	AuthenticateUserCommandHandler,
	LoginError,
} from '../../../../src/services/commands/users/AuthenticateUserCommandHandler';
import { PasswordHasherFactory } from '../../../../src/services/passwordHashers/PasswordHasherFactory';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { createUser } from '../../../createEntry';
import { testUserAuditLogEntry } from '../../../testAuditLogEntry';

describe('AuthenticateUserCommandHandler', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';
	const existingPassword = 'P@$$w0rd';

	let existingUser: User;
	let em: FakeEntityManager;
	let authenticateUserCommandHandler: AuthenticateUserCommandHandler;

	beforeEach(async () => {
		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
			password: existingPassword,
		});

		em = new FakeEntityManager();
		const userRepo = {
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter((u) => u.email === where.email)[0],
		};
		const auditLogger = new AuditLogger(em as any);
		const passwordHasherFactory = new PasswordHasherFactory();

		authenticateUserCommandHandler = new AuthenticateUserCommandHandler(
			em as any,
			userRepo as any,
			auditLogger,
			passwordHasherFactory,
		);
	});

	describe('authenticateUser', () => {
		const defaults = {
			email: existingEmail,
			password: existingPassword,
			ip: '::1',
		};

		test('authenticateUser', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
			});

			expect(result.error).toBe(LoginError.None);
			expect(result.user).toBeDefined();

			if (!result.user) throw new Error();

			const userObject = result.user;

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUser.name);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Login,
				actor: existingUser,
				actorIp: defaults.ip,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('email is undefined', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				email: undefined!,
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is empty', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				email: '',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is whitespace', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				email: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is invalid', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				email: 'invalid_email',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email does not exist', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				email: 'not_found@example.com',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('password is undefined', async () => {
			await expect(
				authenticateUserCommandHandler.execute({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrowError('data and salt arguments required');

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('password is empty', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				password: '',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaults.ip,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('password is whitespace', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				password: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaults.ip,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('password is wrong', async () => {
			const result = await authenticateUserCommandHandler.execute({
				...defaults,
				password: 'wrong_password',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaults.ip,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});
	});
});
