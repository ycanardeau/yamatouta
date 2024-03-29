import {
	TranslationUpdateCommand,
	TranslationUpdateCommandHandler,
} from '@/database/commands/translations/TranslationUpdateCommandHandler';
import { TranslationDto } from '@/dto/TranslationDto';
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
import { NgramConverter } from '@/services/NgramConverter';
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
import { createTranslation, createUser } from 'test/createEntry';

describe('TranslationUpdateCommandHandler', () => {
	let app: INestApplication;
	let em: EntityManager;
	let existingUser: User;
	let translation: Translation;
	let permissionContext: FakePermissionContext;
	let translationUpdateCommandHandler: TranslationUpdateCommandHandler;
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

		translation = await createTranslation(em, {
			headword: '大和言葉',
			locale: 'ojp',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことば',
			actor: existingUser,
		});

		permissionContext = new FakePermissionContext(existingUser);

		translationUpdateCommandHandler = app.get(
			TranslationUpdateCommandHandler,
		);

		defaultParams = {
			id: translation.id,
			headword: '和語',
			locale: 'ja',
			reading: 'わご',
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

	describe('translationUpdate', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: TranslationUpdateParams,
		): Promise<TranslationDto> => {
			return translationUpdateCommandHandler.execute(
				new TranslationUpdateCommand(permissionContext, params),
			);
		};

		const testTranslationUpdate = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: TranslationUpdateParams;
			snapshot: ITranslationSnapshot;
		}): Promise<void> => {
			const translationDto = await execute(permissionContext, params);

			expect(translationDto.headword).toBe(params.headword);
			expect(translationDto.locale).toBe(params.locale);
			expect(translationDto.reading).toBe(params.reading);
			expect(translationDto.yamatokotoba).toBe(params.yamatokotoba);
			expect(translationDto.category).toBe(params.category);

			const translation = await em.findOneOrFail(Translation, {
				id: translationDto.id,
			});

			const ngramConverter = app.get(NgramConverter);
			const searchIndex = translation.searchIndex.getEntity();
			expect(searchIndex.headword).toBe(
				ngramConverter.toFullText(params.headword, 2),
			);
			expect(searchIndex.reading).toBe(
				ngramConverter.toFullText(params.reading, 2),
			);
			expect(searchIndex.yamatokotoba).toBe(
				ngramConverter.toFullText(params.yamatokotoba, 2),
			);

			const revision = translation.revisions[1];

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation.getEntity()).toBe(translation);
			expect(revision.actor.getEntity()).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Updated);
			expect(revision.snapshot).toBe(JSON.stringify(snapshot));

			const auditLogEntry = await em.findOneOrFail(
				TranslationAuditLogEntry,
				{
					translation: translation,
				},
			);

			assertTranslationAuditLogEntry(auditLogEntry, {
				action: AuditedAction.Translation_Update,
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
					execute(permissionContext, defaultParams),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('nothing has changed', async () => {
			await expect(
				execute(permissionContext, {
					...defaultParams,
					headword: translation.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('1 change', async () => {
			await testTranslationUpdate({
				permissionContext,
				params: {
					...defaultParams,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaultParams.headword,
					locale: translation.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
					webLinks: [],
					workLinks: [],
				},
			});
		});

		test('2 changes', async () => {
			await testTranslationUpdate({
				permissionContext,
				params: {
					...defaultParams,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaultParams.headword,
					locale: defaultParams.locale,
					reading: translation.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
					webLinks: [],
					workLinks: [],
				},
			});
		});

		test('3 changes', async () => {
			await testTranslationUpdate({
				permissionContext,
				params: {
					...defaultParams,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
				},
				snapshot: {
					headword: defaultParams.headword,
					locale: defaultParams.locale,
					reading: defaultParams.reading,
					yamatokotoba: translation.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
					webLinks: [],
					workLinks: [],
				},
			});
		});

		test('4 changes', async () => {
			await testTranslationUpdate({
				permissionContext,
				params: {
					...defaultParams,
					category: translation.category,
				},
				snapshot: {
					headword: defaultParams.headword,
					locale: defaultParams.locale,
					reading: defaultParams.reading,
					yamatokotoba: defaultParams.yamatokotoba,
					category: translation.category,
					inishienomanabi_tags: [],
					webLinks: [],
					workLinks: [],
				},
			});
		});

		test('5 changes', async () => {
			await testTranslationUpdate({
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
