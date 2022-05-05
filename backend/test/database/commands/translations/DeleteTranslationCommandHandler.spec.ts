import { MikroORM } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

import {
	DeleteEntryParams,
	DeleteTranslationCommand,
	DeleteTranslationCommandHandler,
} from '../../../../src/database/commands/entries/DeleteEntryCommandHandler';
import { TranslationAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../../src/entities/Revision';
import { Translation } from '../../../../src/entities/Translation';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { TranslationSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { AuditLogEntryFactory } from '../../../../src/services/AuditLogEntryFactory';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createTranslation, createUser } from '../../../createEntry';
import { testTranslationAuditLogEntry } from '../../../testAuditLogEntry';

describe('DeleteTranslationCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let translation: Translation;
	let userRepo: any;
	let auditLogEntryFactory: AuditLogEntryFactory;
	let translationRepo: any;
	let permissionContext: FakePermissionContext;
	let deleteTranslationCommandHandler: DeleteTranslationCommandHandler;

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

		translation = await createTranslation(em as any, {
			id: 2,
			headword: '大和言葉',
			locale: 'ojp',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことば',
			user: existingUser,
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
		translationRepo = {
			findOneOrFail: async (): Promise<Translation> => translation,
		};

		permissionContext = new FakePermissionContext(existingUser);

		deleteTranslationCommandHandler = new DeleteTranslationCommandHandler(
			em as any,
			userRepo as any,
			auditLogEntryFactory,
			translationRepo as any,
		);
	});

	describe('deleteTranslation', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: DeleteEntryParams,
		): Promise<void> => {
			return deleteTranslationCommandHandler.execute(
				new DeleteTranslationCommand(permissionContext, params),
			);
		};

		const testDeleteTranslation = async (): Promise<void> => {
			await execute(permissionContext, {
				entryId: translation.id,
			});

			const revision = em.entities.filter(
				(entity) => entity instanceof TranslationRevision,
			)[0] as TranslationRevision;

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation).toBe(translation);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(new TranslationSnapshot(translation)),
			);

			expect(translation.deleted).toBe(true);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof TranslationAuditLogEntry,
			)[0] as TranslationAuditLogEntry;

			testTranslationAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Translation_Delete,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
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

				await expect(
					execute(permissionContext, {
						entryId: translation.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testDeleteTranslation();
		});
	});
});
