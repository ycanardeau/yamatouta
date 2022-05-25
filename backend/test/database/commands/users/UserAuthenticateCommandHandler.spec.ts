import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';

import {
	UserAuthenticateCommand,
	UserAuthenticateCommandHandler,
	LoginError,
	LoginResult,
} from '../../../../src/database/commands/users/UserAuthenticateCommandHandler';
import { UserAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { UserAuthenticateParams } from '../../../../src/models/users/UserAuthenticateParams';
import { assertUserAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createUser } from '../../../createEntry';

describe('UserAuthenticateCommandHandler', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';
	const existingPassword = 'P@$$w0rd';

	let app: INestApplication;
	let existingUser: User;
	let em: EntityManager;
	let userAuthenticateCommandHandler: UserAuthenticateCommandHandler;
	let defaultParams: UserAuthenticateParams;

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
			password: existingPassword,
		});

		userAuthenticateCommandHandler = app.get(
			UserAuthenticateCommandHandler,
		);

		defaultParams = {
			email: existingEmail,
			password: existingPassword,
			clientIp: '::1',
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('userAuthenticate', () => {
		const execute = (
			params: UserAuthenticateParams,
		): Promise<LoginResult> => {
			return userAuthenticateCommandHandler.execute(
				new UserAuthenticateCommand(params),
			);
		};

		test('userAuthenticate', async () => {
			const result = await execute(defaultParams);

			expect(result.error).toBe(LoginError.None);
			expect(result.user).toBeDefined();

			if (!result.user) throw new Error();

			const userObject = result.user;

			expect(userObject.id).toBe(existingUser.id);
			expect(userObject.name).toBe(existingUser.name);

			const user = await em.findOneOrFail(User, { id: userObject.id });

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: user,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Login,
				actor: existingUser,
				actorIp: defaultParams.clientIp,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('email is undefined', async () => {
			const result = await execute({
				...defaultParams,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				email: undefined!,
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is empty', async () => {
			const result = await execute({
				...defaultParams,
				email: '',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is whitespace', async () => {
			const result = await execute({
				...defaultParams,
				email: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is invalid', async () => {
			const result = await execute({
				...defaultParams,
				email: 'invalid_email',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email does not exist', async () => {
			const result = await execute({
				...defaultParams,
				email: 'not_found@example.com',
			});

			expect(result.error).toBe(LoginError.NotFound);
			expect(result.user).toBeUndefined();

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('password is undefined', async () => {
			await expect(
				execute({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrowError('data and salt arguments required');

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('password is empty', async () => {
			const result = await execute({
				...defaultParams,
				password: '',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: existingUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaultParams.clientIp,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('password is whitespace', async () => {
			const result = await execute({
				...defaultParams,
				password: ' 　\t\t　 ',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: existingUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaultParams.clientIp,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});

		test('password is wrong', async () => {
			const result = await execute({
				...defaultParams,
				password: 'wrong_password',
			});

			expect(result.error).toBe(LoginError.InvalidPassword);
			expect(result.user).toBeUndefined();

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: existingUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_FailedLogin,
				actor: existingUser,
				actorIp: defaultParams.clientIp,
				oldValue: '',
				newValue: '',
				user: existingUser,
			});
		});
	});
});
