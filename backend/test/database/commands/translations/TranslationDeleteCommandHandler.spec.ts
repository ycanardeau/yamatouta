import { EntityManager, MikroORM } from '@mikro-orm/core';
import { INestApplication, UnauthorizedException } from '@nestjs/common';

import {
	TranslationDeleteCommand,
	TranslationDeleteCommandHandler,
} from '../../../../src/database/commands/EntryDeleteCommandHandler';
import { TranslationAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../../src/entities/Revision';
import { Translation } from '../../../../src/entities/Translation';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { EntryDeleteParams } from '../../../../src/models/EntryDeleteParams';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { UserGroup } from '../../../../src/models/UserGroup';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { assertTranslationAuditLogEntry } from '../../../assertAuditLogEntry';
import { createApplication } from '../../../createApplication';
import { createTranslation, createUser } from '../../../createEntry';

describe('TranslationDeleteCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let translation: Translation;
	let permissionContext: FakePermissionContext;
	let translationDeleteCommandHandler: TranslationDeleteCommandHandler;

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

		translation = await createTranslation(em, {
			headword: '大和言葉',
			locale: 'ojp',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことば',
			user: existingUser,
		});

		permissionContext = new FakePermissionContext(existingUser);

		translationDeleteCommandHandler = app.get(
			TranslationDeleteCommandHandler,
		);
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('translationDelete', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: EntryDeleteParams,
		): Promise<void> => {
			return translationDeleteCommandHandler.execute(
				new TranslationDeleteCommand(permissionContext, params),
			);
		};

		const testTranslationDelete = async (): Promise<void> => {
			await execute(permissionContext, {
				id: translation.id,
			});

			const revision = translation.revisions[0];

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation).toBe(translation);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Deleted);
			expect(
				revision.snapshot.contentEquals(translation.takeSnapshot()),
			).toBe(true);

			expect(translation.deleted).toBe(true);

			const auditLogEntry = await em.findOneOrFail(
				TranslationAuditLogEntry,
				{ translation: translation },
			);

			assertTranslationAuditLogEntry(auditLogEntry, {
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
						id: translation.id,
					}),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('delete', async () => {
			await testTranslationDelete();
		});
	});
});
