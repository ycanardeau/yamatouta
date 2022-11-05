import {
	TranslationUpdateCommand,
	TranslationUpdateCommandHandler,
} from '@/database/commands/translations/TranslationUpdateCommandHandler';
import { TranslationObject } from '@/dto/TranslationObject';
import { TranslationAuditLogEntry } from '@/entities/AuditLogEntry';
import { TranslationRevision } from '@/entities/Revision';
import { Translation } from '@/entities/Translation';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { RevisionEvent } from '@/models/RevisionEvent';
import { ITranslationSnapshot } from '@/models/snapshots/TranslationSnapshot';
import { TranslationUpdateParams } from '@/models/translations/TranslationUpdateParams';
import { WordCategory } from '@/models/translations/WordCategory';
import { UserGroup } from '@/models/users/UserGroup';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import {
	BadRequestException,
	INestApplication,
	UnauthorizedException,
} from '@nestjs/common';
import { FakePermissionContext } from 'test/FakePermissionContext';
import { assertTranslationAuditLogEntry } from 'test/assertAuditLogEntry';
import { createApplication } from 'test/createApplication';
import { createUser } from 'test/createEntry';

describe('TranslationCreateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let permissionContext: FakePermissionContext;
	let translationCreateCommandHandler: TranslationUpdateCommandHandler;
	let defaultParams: TranslationUpdateParams;

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

		translationCreateCommandHandler = app.get(
			TranslationUpdateCommandHandler,
		);

		defaultParams = {
			id: 0,
			headword: '大和言葉',
			locale: 'ja',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことのは',
			category: WordCategory.Noun,
			webLinks: [],
			workLinks: [],
		};
	});

	afterEach(async () => {
		const orm = app.get(MikroORM);
		const generator = orm.getSchemaGenerator();

		await generator.clearDatabase();
	});

	describe('translationCreate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: TranslationUpdateParams,
		): Promise<TranslationObject> => {
			return translationCreateCommandHandler.execute(
				new TranslationUpdateCommand(permissionContext, params),
			);
		};

		const testTranslationCreate = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: TranslationUpdateParams;
			snapshot: ITranslationSnapshot;
		}): Promise<void> => {
			const translationObject = await execute(permissionContext, params);

			expect(translationObject.headword).toBe(params.headword);
			expect(translationObject.locale).toBe(params.locale);
			expect(translationObject.reading).toBe(params.reading);
			expect(translationObject.yamatokotoba).toBe(params.yamatokotoba);
			expect(translationObject.category).toBe(params.category);

			const translation = await em.findOneOrFail(Translation, {
				id: translationObject.id,
			});

			const revision = translation.revisions[0];

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation.getEntity()).toBe(translation);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(revision.snapshot).toBe(JSON.stringify(snapshot));

			const auditLogEntry = await em.findOneOrFail(
				TranslationAuditLogEntry,
				{ translation: translation },
			);

			assertTranslationAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Translation_Create,
				actor: existingUser,
				actorIp: permissionContext.clientIp,
				oldValue: '',
				newValue: '',
				translation: translation,
			});
		};

		test('insufficient permission', async () => {
			for (const userGroup of [UserGroup.LimitedUser, UserGroup.User]) {
				existingUser.userGroup = userGroup;

				const permissionContext = new FakePermissionContext(
					existingUser,
				);

				await expect(
					execute(permissionContext, defaultParams),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('5 changes', async () => {
			await testTranslationCreate({
				permissionContext,
				params: defaultParams,
				snapshot: {
					headword: defaultParams.headword,
					locale: defaultParams.locale,
					reading: defaultParams.reading,
					yamatokotoba: defaultParams.yamatokotoba,
					category: defaultParams.category,
					inishienomanabi_tags: [],
					webLinks: [],
					workLinks: [],
				},
			});
		});

		test('headword is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					headword: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					headword: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					headword: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					reading: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					reading: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					reading: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains alphabets', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					reading: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains kanji', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					reading: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is undefined', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					yamatokotoba: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					yamatokotoba: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is too long', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					yamatokotoba: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains alphabets', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					yamatokotoba: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains kanji', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					yamatokotoba: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is empty', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					category: '' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is invalid', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					category: 'abcdef' as WordCategory,
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
