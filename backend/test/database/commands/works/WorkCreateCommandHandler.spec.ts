import {
	WorkUpdateCommand,
	WorkUpdateCommandHandler,
} from '@/database/commands/works/WorkUpdateCommandHandler';
import { WorkObject } from '@/dto/WorkObject';
import { WorkAuditLogEntry } from '@/entities/AuditLogEntry';
import { WorkRevision } from '@/entities/Revision';
import { User } from '@/entities/User';
import { Work } from '@/entities/Work';
import { AuditedAction } from '@/models/AuditedAction';
import { RevisionEvent } from '@/models/RevisionEvent';
import { IWorkSnapshot } from '@/models/snapshots/WorkSnapshot';
import { UserGroup } from '@/models/users/UserGroup';
import { WorkType } from '@/models/works/WorkType';
import { WorkUpdateParams } from '@/models/works/WorkUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertWorkAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createUser } from 'test/createEntry';

describe('WorkCreateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let permissionContext: FakePermissionContext;
	let workCreateCommandHandler: WorkUpdateCommandHandler;
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

		permissionContext = new FakePermissionContext(existingUser);

		workCreateCommandHandler = app.get(WorkUpdateCommandHandler);

		defaultParams = {
			id: 0,
			name: 'よみもの',
			workType: WorkType.Book,
			webLinks: [],
			artistLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('workCreate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: WorkUpdateParams,
		): Promise<WorkObject> => {
			return workCreateCommandHandler.execute(
				new WorkUpdateCommand(permissionContext, params),
			);
		};

		const testWorkCreate = async ({
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
			expect(revision.work.getEntity()).toBe(work);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(revision.snapshot).toBe(JSON.stringify(snapshot));

			const auditLogEntry = await em.findOneOrFail(WorkAuditLogEntry, {
				work: work,
			});

			assertWorkAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Work_Create,
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

		test('2 changes', async () => {
			await testWorkCreate({
				permissionContext,
				params: defaultParams,
				snapshot: {
					name: defaultParams.name,
					sortName: '',
					workType: defaultParams.workType,
					webLinks: [],
					artistLinks: [],
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

		test('workType is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					workType: undefined!,
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
