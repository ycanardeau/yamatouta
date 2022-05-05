import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import {
	UpdateWorkCommand,
	UpdateWorkCommandHandler,
	UpdateWorkParams,
} from '../../../../src/database/commands/works/UpdateWorkCommandHandler';
import { WorkObject } from '../../../../src/dto/works/WorkObject';
import { WorkAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { Work } from '../../../../src/entities/Work';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { WorkSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WorkType } from '../../../../src/models/WorkType';
import { AuditLogEntryFactory } from '../../../../src/services/AuditLogEntryFactory';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createWork, createUser } from '../../../createEntry';
import { testWorkAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateWorkCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let work: Work;
	let userRepo: any;
	let auditLogEntryFactory: AuditLogEntryFactory;
	let workRepo: any;
	let webAddressFactory: any;
	let permissionContext: FakePermissionContext;
	let updateWorkCommandHandler: UpdateWorkCommandHandler;
	let defaultParams: UpdateWorkParams;

	beforeAll(async () => {
		// See https://stackoverflow.com/questions/69924546/unit-testing-mirkoorm-entities.
		await MikroORM.init(undefined, false);
	});

	beforeEach(async () => {
		em = new FakeEntityManager();

		existingUser = await createUser(em as any, {
			id: 1,
			username: 'existing',
			email: 'existing@example.com',
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		work = await createWork(em as any, {
			id: 2,
			name: 'よみもの',
			workType: WorkType.Book,
		});

		userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			persist: (): void => {},
		};
		auditLogEntryFactory = new AuditLogEntryFactory();
		workRepo = {
			findOneOrFail: async (where: any): Promise<Work> =>
				[work].filter((w) => w.id === where.id)[0],
		};
		webAddressFactory = {};

		permissionContext = new FakePermissionContext(existingUser);

		updateWorkCommandHandler = new UpdateWorkCommandHandler(
			em as any,
			userRepo as any,
			auditLogEntryFactory,
			workRepo as any,
			webAddressFactory,
		);

		defaultParams = {
			workId: work.id,
			name: 'うた',
			workType: WorkType.Song,
			webLinks: [],
		};
	});

	describe('updateWork', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateWorkParams,
		): Promise<WorkObject> => {
			return updateWorkCommandHandler.execute(
				new UpdateWorkCommand(permissionContext, params),
			);
		};

		const testUpdateWork = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: UpdateWorkParams;
			snapshot: WorkSnapshot;
		}): Promise<void> => {
			const workObject = await execute(permissionContext, params);

			expect(workObject.name).toBe(params.name);
			expect(workObject.workType).toBe(params.workType);

			const revision = em.entities.filter(
				(entity) => entity instanceof WorkRevision,
			)[0] as WorkRevision;

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work).toBe(work);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof WorkAuditLogEntry,
			)[0] as WorkAuditLogEntry;

			testWorkAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Work_Update,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
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

				await expect(
					execute(permissionContext, defaultParams),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateWork({
				permissionContext,
				params: {
					...defaultParams,
					name: work.name,
					workType: work.workType,
				},
				snapshot: {
					name: work.name,
					workType: work.workType,
					webLinks: [],
				},
			});
		});

		test('1 change', async () => {
			await testUpdateWork({
				permissionContext,
				params: {
					...defaultParams,
					workType: work.workType,
				},
				snapshot: {
					name: defaultParams.name,
					workType: work.workType,
					webLinks: [],
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateWork({
				permissionContext,
				params: defaultParams,
				snapshot: {
					name: defaultParams.name,
					workType: defaultParams.workType,
					webLinks: [],
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					workType: '' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					workType: 'abcdef' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('webLinks is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					webLinks: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
