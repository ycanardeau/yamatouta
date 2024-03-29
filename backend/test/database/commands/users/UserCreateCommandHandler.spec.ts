import {
	UserCreateCommand,
	UserCreateCommandHandler,
} from '@/database/commands/users/UserCreateCommandHandler';
import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { UserAuditLogEntry } from '@/entities/AuditLogEntry';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { UserCreateParams } from '@/models/users/UserCreateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { normalizeEmail } from '@/utils/normalizeEmail';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertUserAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createUser } from 'test/createEntry';

describe('UserCreateCommandHandler', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';

	let app: INestApplication;
	let em: EntityManager;
	let permissionContext: FakePermissionContext;
	let userCreateCommandHandler: UserCreateCommandHandler;
	let defaultParams: UserCreateParams;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		await createUser(em, {
			username: existingUsername,
			email: existingEmail,
			password: 'P@$$w0rd',
		});

		permissionContext = new FakePermissionContext();

		userCreateCommandHandler = app.get(UserCreateCommandHandler);

		defaultParams = {
			username: 'user',
			email: 'user@example.com',
			password: 'P@$$w0rd',
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('userCreate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UserCreateParams,
		): Promise<AuthenticatedUserDto> => {
			return userCreateCommandHandler.execute(
				new UserCreateCommand(permissionContext, params),
			);
		};

		test('userCreate', async () => {
			const userDto = await execute(permissionContext, defaultParams);

			expect(userDto.name).toBe(defaultParams.username);

			const newUser = await em.findOneOrFail(User, {
				normalizedEmail: await normalizeEmail(defaultParams.email),
			});

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: newUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('minimum username length', async () => {
			const username = 'ab';

			expect(username.length).toBe(2);

			const userDto = await execute(permissionContext, {
				...defaultParams,
				username: username,
			});

			expect(userDto.name).toBe(username);

			const newUser = await em.findOneOrFail(User, {
				normalizedEmail: await normalizeEmail(defaultParams.email),
			});

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: newUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('maximum username length', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(username.length).toBe(32);

			const userDto = await execute(permissionContext, {
				...defaultParams,
				username: username,
			});

			expect(userDto.name).toBe(username);

			const newUser = await em.findOneOrFail(User, {
				normalizedEmail: await normalizeEmail(defaultParams.email),
			});

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = await em.findOneOrFail(UserAuditLogEntry, {
				user: newUser,
			});

			assertUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('username is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					username: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					username: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is whitespace', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is too short', async () => {
			const username = 'い';

			expect(username.length).toBe(1);

			await expect(
				execute(permissionContext, {
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('username is too long', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(username.length).toBe(33);

			await expect(
				execute(permissionContext, {
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is existing', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					email: existingEmail,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					email: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					email: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('email is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('password is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('password is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					password: '',
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});

		test('password is too short', async () => {
			const password = 'P@$$w0r';

			expect(password.length).toBe(7);

			await expect(
				execute(permissionContext, {
					...defaultParams,
					password: password,
				}),
			).rejects.toThrow(BadRequestException);

			expect(await em.getRepository(UserAuditLogEntry).count()).toBe(0);
		});
	});
});
