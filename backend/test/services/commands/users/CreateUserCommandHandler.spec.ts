import { AnyEntity, Reference } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';

import { UserAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import { CreateUserCommandHandler } from '../../../../src/services/commands/users/CreateUserCommandHandler';
import { PasswordHasherFactory } from '../../../../src/services/passwordHashers/PasswordHasherFactory';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createUser } from '../../../createEntry';
import { testUserAuditLogEntry } from '../../../testAuditLogEntry';

describe('CreateUserCommandHandler', () => {
	const existingUsername = 'existing';
	const existingEmail = 'existing@example.com';

	let existingUser: User;
	let em: FakeEntityManager;
	let permissionContext: FakePermissionContext;
	let createUserCommandHandler: CreateUserCommandHandler;

	beforeEach(async () => {
		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
			password: 'P@$$w0rd',
		});

		em = new FakeEntityManager();
		const userRepo = {
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			persist: (
				entity:
					| AnyEntity
					| Reference<AnyEntity>
					| (AnyEntity | Reference<AnyEntity>)[],
			): void => em.persist(entity),
		};
		const auditLogger = new AuditLogger(em as any);
		permissionContext = new FakePermissionContext();
		const passwordHasherFactory = new PasswordHasherFactory();

		createUserCommandHandler = new CreateUserCommandHandler(
			em as any,
			userRepo as any,
			auditLogger,
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
			const userObject = await createUserCommandHandler.execute({
				...defaultParams,
			});

			expect(userObject.name).toBe(defaultParams.username);

			const newUser = em.entities.filter(
				(entity) => entity instanceof User,
			)[0] as User;

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('minimum username length', async () => {
			const username = 'ab';

			expect(username.length).toBe(2);

			const userObject = await createUserCommandHandler.execute({
				...defaultParams,
				username: username,
			});

			expect(userObject.name).toBe(username);

			const newUser = em.entities.filter(
				(entity) => entity instanceof User,
			)[0] as User;

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('maximum username length', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふ';

			expect(username.length).toBe(32);

			const userObject = await createUserCommandHandler.execute({
				...defaultParams,
				username: username,
			});

			expect(userObject.name).toBe(username);

			const newUser = em.entities.filter(
				(entity) => entity instanceof User,
			)[0] as User;

			expect(newUser).toBeInstanceOf(User);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			testUserAuditLogEntry(auditLogEntry, {
				action: AuditedAction.User_Create,
				actor: newUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				user: newUser,
			});
		});

		test('username is undefined', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					username: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is empty', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
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
				createUserCommandHandler.execute({
					...defaultParams,
					username: ' 　\t\t　 ',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is too short', async () => {
			const username = 'い';

			expect(username.length).toBe(1);

			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('username is too long', async () => {
			const username =
				'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこ';

			expect(username.length).toBe(33);

			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					username: username,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is existing', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					email: existingEmail,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is undefined', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					email: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('email is empty', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
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
				createUserCommandHandler.execute({
					...defaultParams,
					email: 'invalid_email',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('password is undefined', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					password: undefined!,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('password is empty', async () => {
			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					password: '',
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});

		test('password is too short', async () => {
			const password = 'P@$$w0r';

			expect(password.length).toBe(7);

			await expect(
				createUserCommandHandler.execute({
					...defaultParams,
					password: password,
				}),
			).rejects.toThrow(BadRequestException);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof UserAuditLogEntry,
			)[0] as UserAuditLogEntry;

			expect(auditLogEntry).toBeUndefined();
		});
	});
});
