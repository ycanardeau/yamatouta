import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../src/entities/Revision';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { TranslationSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { DeleteTranslationService } from '../../../src/services/translations/DeleteTranslationService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createTranslation, createUser } from '../../createEntry';
import { testTranslationAuditLogEntry } from '../../testAuditLogEntry';

describe('DeleteTranslationService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let translation: Translation;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let translationRepo: any;
	let permissionContext: FakePermissionContext;
	let deleteTranslationService: DeleteTranslationService;

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

		translation = createTranslation({
			id: 2,
			headword: '大和言葉',
			locale: 'ojp',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことば',
			user: existingUser,
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
		translationRepo = {
			findOneOrFail: async (): Promise<Translation> => translation,
		};

		permissionContext = new FakePermissionContext(existingUser);

		deleteTranslationService = new DeleteTranslationService(
			permissionContext,
			em as any,
			userRepo as any,
			translationRepo as any,
			auditLogService,
		);
	});

	describe('deleteTranslation', () => {
		const testDeleteTranslation = async (): Promise<void> => {
			await deleteTranslationService.deleteTranslation(translation.id);

			const revision = em.entities.filter(
				(entity) => entity instanceof TranslationRevision,
			)[0] as TranslationRevision;

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation).toBe(translation);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(
					new TranslationSnapshot({ translation: translation }),
				),
			);

			expect(translation.deleted).toBe(true);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof TranslationAuditLogEntry,
			)[0] as TranslationAuditLogEntry;

			testTranslationAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Translation_Delete,
				actor: existingUser,
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				translation: translation,
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

				deleteTranslationService = new DeleteTranslationService(
					permissionContext,
					em as any,
					userRepo as any,
					translationRepo as any,
					auditLogService,
				);

				await expect(
					deleteTranslationService.deleteTranslation(translation.id),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteTranslation();
		});
	});
});
