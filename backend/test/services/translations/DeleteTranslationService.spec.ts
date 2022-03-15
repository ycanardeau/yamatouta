import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { TranslationChangeLogEntry } from '../../../src/entities/ChangeLogEntry';
import { Revision } from '../../../src/entities/Revision';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { ChangeLogEvent } from '../../../src/models/ChangeLogEvent';
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
				(entity) => entity instanceof Revision,
			)[0] as Revision;

			expect(revision).toBeInstanceOf(Revision);
			expect(revision.changeLogEntries.length).toBe(1);

			const changeLogEntry = revision
				.changeLogEntries[0] as TranslationChangeLogEntry;
			expect(changeLogEntry).toBeInstanceOf(TranslationChangeLogEntry);

			expect(changeLogEntry.revision.getEntity()).toBe(revision);
			expect(changeLogEntry.changes.length).toBe(0);
			expect(changeLogEntry.actor).toBe(existingUser);
			expect(changeLogEntry.actionType).toBe(ChangeLogEvent.Deleted);
			expect(changeLogEntry.translation).toBe(translation);

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

			expect(changeLogEntry.translation.headword).toBe(
				translation.headword,
			);
			expect(changeLogEntry.translation.locale).toBe(translation.locale);
			expect(changeLogEntry.translation.reading).toBe(
				translation.reading,
			);
			expect(changeLogEntry.translation.yamatokotoba).toBe(
				translation.yamatokotoba,
			);
			expect(changeLogEntry.translation.category).toBe(
				translation.category,
			);
			expect(changeLogEntry.translation.deleted).toBe(true);
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
