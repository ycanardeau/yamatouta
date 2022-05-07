import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';

import {
	DeleteEntryParams,
	DeleteWorkCommand,
	DeleteWorkCommandHandler,
} from '../../../../src/database/commands/entries/DeleteEntryCommandHandler';
import { WorkAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../../src/entities/Revision';
import { User } from '../../../../src/entities/User';
import { Work } from '../../../../src/entities/Work';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WorkType } from '../../../../src/models/WorkType';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertWorkAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createUser, createWork } from '../../../createEntry';

describe('DeleteWorkCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let work: Work;
	let permissionContext: FakePermissionContext;
	let deleteWorkCommandHandler: DeleteWorkCommandHandler;

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

		deleteWorkCommandHandler = app.get(DeleteWorkCommandHandler);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('deleteWork', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: DeleteEntryParams,
		): Promise<void> => {
			return deleteWorkCommandHandler.execute(
				new DeleteWorkCommand(permissionContext, params),
			);
		};

		const testDeleteWork = async (): Promise<void> => {
			await execute(permissionContext, { entryId: work.id });

			const revision = work.revisions[0];

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work).toBe(work);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(revision.snapshot.contentEquals(work.takeSnapshot())).toBe(
				true,
			);

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
						entryId: work.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteWork();
		});
	});
});
