import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';

import {
	WorkUpdateCommand,
	WorkUpdateCommandHandler,
} from '../../../../src/database/commands/works/WorkUpdateCommandHandler';
import { WorkObject } from '../../../../src/dto/WorkObject';
import { WorkAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { Work } from '../../../../src/entities/Work';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { UserGroup } from '../../../../src/models/UserGroup';
import { IWorkSnapshot } from '../../../../src/models/snapshots/WorkSnapshot';
import { WorkType } from '../../../../src/models/works/WorkType';
import { WorkUpdateParams } from '../../../../src/models/works/WorkUpdateParams';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertWorkAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createUser, createWork } from '../../../createEntry';

describe('WorkUpdateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let work: Work;
	let permissionContext: FakePermissionContext;
	let workUpdateCommandHandler: WorkUpdateCommandHandler;
	let defaultParams: WorkUpdateParams;

	beforeAll(async () => {
		app = await createApplication();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		em = app.get(EntityManager);

		existingUser = await createUser(em, {
			username: 'existing',
			email: 'existing@example.com',
			password: 'P@$$w0rd',
			userGroup: UserGroup.Admin,
		});

		work = await createWork(em, {
			name: 'よみもの',
			workType: WorkType.Book,
		});

		permissionContext = new FakePermissionContext(existingUser);

		workUpdateCommandHandler = app.get(WorkUpdateCommandHandler);

		defaultParams = {
			id: work.id,
			name: 'うた',
			workType: WorkType.Song,
			webLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('workUpdate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: WorkUpdateParams,
		): Promise<WorkObject> => {
			return workUpdateCommandHandler.execute(
				new WorkUpdateCommand(permissionContext, params),
			);
		};

		const testWorkUpdate = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: WorkUpdateParams;
			snapshot: IWorkSnapshot;
		}): Promise<void> => {
			const workObject = await execute(permissionContext, params);

			expect(workObject.name).toBe(params.name);
			expect(workObject.workType).toBe(params.workType);

			const work = await em.findOneOrFail(Work, { id: workObject.id });

			const revision = work.revisions[0];

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work).toBe(work);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(revision.snapshot.contentEquals(snapshot)).toBe(true);

			const auditLogEntry = await em.findOneOrFail(WorkAuditLogEntry, {
				work: work,
			});

			assertWorkAuditLogEntry(auditLogEntry, {
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

		test('nothing has changed', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					name: work.name,
					workType: work.workType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('1 change', async () => {
			await testWorkUpdate({
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
			await testWorkUpdate({
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
