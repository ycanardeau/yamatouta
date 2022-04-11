import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { WorkAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../src/entities/Revision';
import { User } from '../../../src/entities/User';
import { Work } from '../../../src/entities/Work';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { WorkSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { WorkType } from '../../../src/models/WorkType';
import { IUpdateWorkBody } from '../../../src/requests/works/IUpdateWorkBody';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { CreateWorkService } from '../../../src/services/works/CreateWorkService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createUser } from '../../createEntry';
import { testWorkAuditLogEntry } from '../../testAuditLogEntry';

describe('CreateWorkService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let permissionContext: FakePermissionContext;
	let createWorkService: CreateWorkService;

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
		auditLogService = new AuditLogService(em as any);

		permissionContext = new FakePermissionContext(existingUser);

		createWorkService = new CreateWorkService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogService,
		);
	});

	describe('createWork', () => {
		const testCreateWork = async ({
			params,
			snapshot,
		}: {
			params: IUpdateWorkBody;
			snapshot: WorkSnapshot;
		}): Promise<void> => {
			const workObject = await createWorkService.createWork(params);

			expect(workObject.name).toBe(params.name);
			expect(workObject.workType).toBe(params.workType);

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

		const defaults = {
			name: 'よみもの',
			workType: WorkType.Book,
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

				createWorkService = new CreateWorkService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogService,
				);

				await expect(
					createWorkService.createWork(defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('2 changes', async () => {
			await testCreateWork({
				params: defaults,
				snapshot: {
					name: defaults.name,
					workType: defaults.workType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is undefined', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					workType: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is empty', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					workType: '' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is invalid', async () => {
			await expect(
				createWorkService.createWork({
					...defaults,
					workType: 'abcdef' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
