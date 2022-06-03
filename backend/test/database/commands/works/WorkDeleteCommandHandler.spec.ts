import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';

import {
	WorkDeleteCommand,
	WorkDeleteCommandHandler,
} from '../../../../src/database/commands/EntryDeleteCommandHandler';
import { WorkAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { Work } from '../../../../src/entities/Work';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { EntryDeleteParams } from '../../../../src/models/EntryDeleteParams';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WorkType } from '../../../../src/models/works/WorkType';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertWorkAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createUser, createWork } from '../../../createEntry';

describe('WorkDeleteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let work: Work;
	let permissionContext: FakePermissionContext;
	let workDeleteCommandHandler: WorkDeleteCommandHandler;

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
			actor: existingUser,
		});

		permissionContext = new FakePermissionContext(existingUser);

		workDeleteCommandHandler = app.get(WorkDeleteCommandHandler);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('workDelete', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: EntryDeleteParams,
		): Promise<void> => {
			return workDeleteCommandHandler.execute(
				new WorkDeleteCommand(permissionContext, params),
			);
		};

		const testWorkDelete = async (): Promise<void> => {
			await execute(permissionContext, { id: work.id });

			const revision = work.revisions[1];

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work.getEntity()).toBe(work);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(revision.snapshot).toBe(JSON.stringify(work.takeSnapshot()));

			expect(work.deleted).toBe(true);

			const auditLogEntry = await em.findOneOrFail(WorkAuditLogEntry, {
				work: work,
			});

			assertWorkAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Work_Delete,
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
					execute(permissionContext, {
						id: work.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testWorkDelete();
		});
	});
});
