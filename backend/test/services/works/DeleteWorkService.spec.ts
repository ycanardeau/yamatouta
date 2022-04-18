import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import { WorkAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { WorkRevision } from '../../../src/entities/Revision';
import { User } from '../../../src/entities/User';
import { Work } from '../../../src/entities/Work';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { WorkSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { WorkType } from '../../../src/models/WorkType';
import { AuditLogger } from '../../../src/services/AuditLogger';
import { DeleteWorkService } from '../../../src/services/entries/DeleteEntryService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createWork, createUser } from '../../createEntry';
import { testWorkAuditLogEntry } from '../../testAuditLogEntry';

describe('DeleteWorkService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let work: Work;
	let userRepo: any;
	let auditLogger: AuditLogger;
	let workRepo: any;
	let permissionContext: FakePermissionContext;
	let deleteWorkService: DeleteWorkService;

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

		work = createWork({
			id: 2,
			name: 'よみもの',
			workType: WorkType.Book,
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
		workRepo = {
			findOneOrFail: async (): Promise<Work> => work,
		};

		permissionContext = new FakePermissionContext(existingUser);

		deleteWorkService = new DeleteWorkService(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogger,
			workRepo as any,
		);
	});

	describe('deleteWork', () => {
		const testDeleteWork = async (): Promise<void> => {
			await deleteWorkService.execute(work.id);

			const revision = em.entities.filter(
				(entity) => entity instanceof WorkRevision,
			)[0] as WorkRevision;

			expect(revision).toBeInstanceOf(WorkRevision);
			expect(revision.work).toBe(work);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(new WorkSnapshot({ work: work })),
			);

			expect(work.deleted).toBe(true);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof WorkAuditLogEntry,
			)[0] as WorkAuditLogEntry;

			testWorkAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Work_Delete,
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

				deleteWorkService = new DeleteWorkService(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogger,
					workRepo as any,
				);

				await expect(
					deleteWorkService.execute(work.id),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteWork();
		});
	});
});
