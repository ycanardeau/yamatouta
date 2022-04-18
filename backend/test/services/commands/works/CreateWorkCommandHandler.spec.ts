import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { WorkAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { Work } from '../../../../src/entities/Work';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { WorkSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WorkType } from '../../../../src/models/WorkType';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import { CreateWorkCommandHandler } from '../../../../src/services/commands/works/CreateWorkCommandHandler';
import { UpdateWorkCommand } from '../../../../src/services/commands/works/UpdateWorkCommandHandler';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createUser } from '../../../createEntry';
import { testWorkAuditLogEntry } from '../../../testAuditLogEntry';

describe('CreateWorkCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let auditLogger: AuditLogger;
	let permissionContext: FakePermissionContext;
	let createWorkCommandHandler: CreateWorkCommandHandler;
	let defaultCommand: UpdateWorkCommand;

	beforeAll(async () => {
		// See https://stackoverflow.com/questions/69924546/unit-testing-mirkoorm-entities.
		await MikroORM.init(undefined, false);
	});

	beforeEach(async () => {
		const existingUsername = 'existing';
		const existingEmail = 'existing@example.com';

		existingUser = await createUser({
			id: 1,
			username: existingUsername,
			email: existingEmail,
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		em = new FakeEntityManager();
		userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			persist: (): void => {},
		};
		auditLogger = new AuditLogger(em as any);

		permissionContext = new FakePermissionContext(existingUser);

		createWorkCommandHandler = new CreateWorkCommandHandler(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogger,
		);

		defaultCommand = {
			workId: undefined,
			name: 'よみもの',
			workType: WorkType.Book,
		};
	});

	describe('createWork', () => {
		const testCreateWork = async ({
			command,
			snapshot,
		}: {
			command: UpdateWorkCommand;
			snapshot: WorkSnapshot;
		}): Promise<void> => {
			const workObject = await createWorkCommandHandler.execute(command);

			expect(workObject.name).toBe(command.name);
			expect(workObject.workType).toBe(command.workType);

			const work = em.entities.filter(
				(entity) => entity instanceof Work,
			)[0] as Work;

			const revision = em.entities.filter(
				(entity) => entity instanceof WorkRevision,
			)[0] as WorkRevision;

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work).toBe(work);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof WorkAuditLogEntry,
			)[0] as WorkAuditLogEntry;

			testWorkAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Work_Create,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				work: work,
			});
		};

		test('insufficient permission', async () => {
			const userGroups = Object.values(UserGroup).filter(
				(userGroup) => userGroup !== UserGroup.Admin,
			);

			for (const userGroup of userGroups) {
				existingUser.userGroup = userGroup;

				const permissionContext = new FakePermissionContext(
					existingUser,
				);

				createWorkCommandHandler = new CreateWorkCommandHandler(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogger,
				);

				await expect(
					createWorkCommandHandler.execute(defaultCommand),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('2 changes', async () => {
			await testCreateWork({
				command: defaultCommand,
				snapshot: {
					name: defaultCommand.name,
					workType: defaultCommand.workType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is undefined', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					workType: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is empty', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					workType: '' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is invalid', async () => {
			await expect(
				createWorkCommandHandler.execute({
					...defaultCommand,
					workType: 'abcdef' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
