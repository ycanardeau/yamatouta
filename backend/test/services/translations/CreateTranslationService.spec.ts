import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { TranslationRevision } from '../../../src/entities/Revision';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { RevisionEvent } from '../../../src/models/RevisionEvent';
import { TranslationSnapshot } from '../../../src/models/Snapshot';
import { UserGroup } from '../../../src/models/UserGroup';
import { WordCategory } from '../../../src/models/WordCategory';
import { IUpdateTranslationBody } from '../../../src/requests/translations/IUpdateTranslationBody';
import { AuditLogService } from '../../../src/services/AuditLogService';
import { NgramConverter } from '../../../src/services/NgramConverter';
import { CreateTranslationService } from '../../../src/services/translations/CreateTranslationService';
import { FakeEntityManager } from '../../FakeEntityManager';
import { FakePermissionContext } from '../../FakePermissionContext';
import { createUser } from '../../createEntry';
import { testTranslationAuditLogEntry } from '../../testAuditLogEntry';

describe('CreateTranslationService', () => {
	let em: FakeEntityManager;
	let existingUser: User;
	let userRepo: any;
	let auditLogService: AuditLogService;
	let ngramConverter: NgramConverter;
	let permissionContext: FakePermissionContext;
	let createTranslationService: CreateTranslationService;

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
		auditLogService = new AuditLogService(em as any);
		ngramConverter = new NgramConverter();

		permissionContext = new FakePermissionContext(existingUser);

		createTranslationService = new CreateTranslationService(
			em as any,
			permissionContext,
			userRepo as any,
			auditLogService,
			ngramConverter,
		);
	});

	describe('createTranslation', () => {
		const testCreateTranslation = async ({
			params,
			snapshot,
		}: {
			params: IUpdateTranslationBody;
			snapshot: TranslationSnapshot;
		}): Promise<void> => {
			const translationObject =
				await createTranslationService.createTranslation(params);

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
				actorIp: permissionContext.remoteIpAddress,
				oldValue: '',
				newValue: '',
				translation: translation,
			});
		};

		const defaults = {
			headword: '大和言葉',
			locale: 'ja',
			reading: 'やまとことば',
			yamatokotoba: 'やまとことのは',
			category: WordCategory.Noun,
		};

		test('insufficient permission', async () => {
			for (const userGroup of [UserGroup.LimitedUser, UserGroup.User]) {
				existingUser.userGroup = userGroup;

				const permissionContext = new FakePermissionContext(
					existingUser,
				);

				createTranslationService = new CreateTranslationService(
					em as any,
					permissionContext,
					userRepo as any,
					auditLogService,
					ngramConverter,
				);

				await expect(
					createTranslationService.createTranslation(defaults),
				).rejects.toThrow(UnauthorizedException);
			}
		});

		test('5 changes', async () => {
			await testCreateTranslation({
				params: defaults,
				snapshot: {
					headword: defaults.headword,
					locale: defaults.locale,
					reading: defaults.reading,
					yamatokotoba: defaults.yamatokotoba,
					category: defaults.category,
					inishienomanabi_tags: [],
				},
			});
		});

		test('headword is undefined', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					headword: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is empty', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					headword: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('headword is too long', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					headword: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is undefined', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					reading: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is empty', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					reading: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading is too long', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					reading: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains alphabets', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					reading: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('reading contains kanji', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					reading: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is undefined', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					yamatokotoba: undefined!,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is empty', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					yamatokotoba: '',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba is too long', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					yamatokotoba: 'い'.repeat(201),
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains alphabets', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					yamatokotoba: 'Anglish',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('yamatokotoba contains kanji', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					yamatokotoba: '大和言葉',
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is empty', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					category: '' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});

		test('category is invalid', async () => {
			await expect(
				createTranslationService.createTranslation({
					...defaults,
					category: 'abcdef' as WordCategory,
				}),
			).rejects.toThrow(BadRequestException);
		});
	});
});
