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
import { IUpdateWorkBody } from '../../../../src/requests/works/IUpdateWorkBody';
import { AuditLogger } from '../../../../src/services/AuditLogger';
import { UpdateWorkCommandHandler } from '../../../../src/services/commands/works/UpdateWorkCommandHandler';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createWork, createUser } from '../../../createEntry';
import { testWorkAuditLogEntry } from '../../../testAuditLogEntry';

describe('UpdateWorkCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let work: Work;
	let userRepo: any;
	let auditLogger: AuditLogger;
	let workRepo: any;
	let permissionContext: FakePermissionContext;
	let updateWorkCommandHandler: UpdateWorkCommandHandler;

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

		updateWorkCommandHandler = new UpdateWorkCommandHandler(
			permissionContext,
			em as any,
			userRepo as any,
			auditLogger,
			workRepo as any,
		);
	});

	describe('updateWork', () => {
		const testUpdateWork = async ({
			body,
			snapshot,
		}: {
			body: IUpdateWorkBody;
			snapshot: WorkSnapshot;
		}): Promise<void> => {
			const workObject = await updateWorkCommandHandler.execute(
				work.id,
				body,
			);

			expect(workObject.name).toBe(body.name);
			expect(workObject.workType).toBe(body.workType);

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
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				work: work,
			});
		};

		const defaults = {
			name: 'うた',
			workType: WorkType.Song,
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

				updateWorkCommandHandler = new UpdateWorkCommandHandler(
					permissionContext,
					em as any,
					userRepo as any,
					auditLogger,
					workRepo as any,
				);

				await expect(
					updateWorkCommandHandler.execute(work.id, defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('0 changes', async () => {
			await testUpdateWork({
				body: {
					name: work.name,
					workType: work.workType,
				},
				snapshot: {
					name: work.name,
					workType: work.workType,
				},
			});
		});

		test('1 change', async () => {
			await testUpdateWork({
				body: {
					...defaults,
					workType: work.workType,
				},
				snapshot: {
					name: defaults.name,
					workType: work.workType,
				},
			});
		});

		test('2 changes', async () => {
			await testUpdateWork({
				body: defaults,
				snapshot: {
					name: defaults.name,
					workType: defaults.workType,
				},
			});
		});

		test('name is undefined', async () => {
			await expect(
				updateWorkCommandHandler.execute(work.id, {
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					name: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is empty', async () => {
			await expect(
				updateWorkCommandHandler.execute(work.id, {
					...defaults,
					name: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('name is too long', async () => {
			await expect(
				updateWorkCommandHandler.execute(work.id, {
					...defaults,
					name: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is empty', async () => {
			await expect(
				updateWorkCommandHandler.execute(work.id, {
					...defaults,
					workType: '' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('workType is invalid', async () => {
			await expect(
				updateWorkCommandHandler.execute(work.id, {
					...defaults,
					workType: 'abcdef' as WorkType,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
