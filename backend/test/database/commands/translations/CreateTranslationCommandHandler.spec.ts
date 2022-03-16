import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import {
	CreateTranslationCommand,
	CreateTranslationCommandHandler,
} from '../../../../src/database/commands/translations/CreateTranslationCommandHandler';
import { UpdateTranslationParams } from '../../../../src/database/commands/translations/UpdateTranslationCommandHandler';
import { TranslationObject } from '../../../../src/dto/translations/TranslationObject';
import { TranslationAuditLogEntry } from '../../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../../src/entities/Revision';
import { Translation } from '../../../../src/entities/Translation';
import { User } from '../../../../src/entities/User';
import { AuditedAction } from '../../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../../src/models/RevisionEvent';
import { TranslationSnapshot } from '../../../../src/models/Snapshot';
import { UserGroup } from '../../../../src/models/UserGroup';
import { WordCategory } from '../../../../src/models/WordCategory';
import { AuditLogEntryFactory } from '../../../../src/services/AuditLogEntryFactory';
import { NgramConverter } from '../../../../src/services/NgramConverter';
import { PermissionContext } from '../../../../src/services/PermissionContext';
import { FakeEntityManager } from '../../../FakeEntityManager';
import { FakePermissionContext } from '../../../FakePermissionContext';
import { createUser } from '../../../createEntry';
import { testTranslationAuditLogEntry } from '../../../testAuditLogEntry';

describe('CreateTranslationCommandHandler', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let auditLogEntryFactory: AuditLogEntryFactory;
	let ngramConverter: NgramConverter;
	let permissionContext: FakePermissionContext;
	let createTranslationCommandHandler: CreateTranslationCommandHandler;
	let defaultParams: UpdateTranslationParams;

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

		em = new FakeEntityManager();
		userRepo = {
			findOneOrFail: async (): Promise<User> => existingUser,
			findOne: async (where: any): Promise<User> =>
				[existingUser].filter(
					(u) => u.normalizedEmail === where.normalizedEmail,
				)[0],
			persist: (): void => {},
		};
		auditLogEntryFactory = new AuditLogEntryFactory();
		ngramConverter = new NgramConverter();

		permissionContext = new FakePermissionContext(existingUser);

		createTranslationCommandHandler = new CreateTranslationCommandHandler(
			em as any,
			userRepo as any,
			auditLogEntryFactory,
			ngramConverter,
		);

		defaultParams = {
			translationId: undefined,
			headword: '大和言葉',
			locale: 'ja',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことのは',
			category: WordCategory.Noun,
		};
	});

	describe('createTranslation', () => {
		const execute = (
			permissionContext: PermissionContext,
			params: UpdateTranslationParams,
		): Promise<TranslationObject> => {
			return createTranslationCommandHandler.execute(
				new CreateTranslationCommand(permissionContext, params),
			);
		};

		const testCreateTranslation = async ({
			permissionContext,
			params,
			snapshot,
		}: {
			permissionContext: PermissionContext;
			params: UpdateTranslationParams;
			snapshot: TranslationSnapshot;
		}): Promise<void> => {
			const translationObject = await execute(permissionContext, params);

			expect(translationObject.headword).toBe(params.headword);
			expect(translationObject.locale).toBe(params.locale);
			expect(translationObject.reading).toBe(params.reading);
			expect(translationObject.yamatokotoba).toBe(params.yamatokotoba);
			expect(translationObject.category).toBe(params.category);

			const translation = em.entities.filter(
				(entity) => entity instanceof Translation,
			)[0] as Translation;

			const revision = em.entities.filter(
				(entity) => entity instanceof TranslationRevision,
			)[0] as TranslationRevision;

			expect(revision).toBeInstanceOf(TranslationRevision);
			expect(revision.translation).toBe(translation);
			expect(revision.actor).toBe(existingUser);
			expect(revision.event).toBe(RevisionEvent.Created);
			expect(JSON.stringify(revision.snapshot)).toBe(
				JSON.stringify(snapshot),
			);

			const auditLogEntry = em.entities.filter(
				(entity) => entity instanceof TranslationAuditLogEntry,
			)[0] as TranslationAuditLogEntry;

			testTranslationAuditLogEntry(auditLogEntry, {
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
			await testCreateTranslation({
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
	});
});
