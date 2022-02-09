import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TranslationAuditLogEntry } from '../../../src/entities/AuditLogEntry';
import { ChangeLogChange } from '../../../src/entities/ChangeLogChange';
import { TranslationChangeLogEntry } from '../../../src/entities/ChangeLogEntry';
import { Revision } from '../../../src/entities/Revision';
import { Translation } from '../../../src/entities/Translation';
import { User } from '../../../src/entities/User';
import { NgramConverter } from '../../../src/helpers/NgramConverter';
import { AuditedAction } from '../../../src/models/AuditedAction';
import { ChangeLogChangeKey } from '../../../src/models/ChangeLogChangeKey';
import { ChangeLogEvent } from '../../../src/models/ChangeLogEvent';
import { UserGroup } from '../../../src/models/UserGroup';
import { WordCategory } from '../../../src/models/WordCategory';
import { IUpdateTranslationBody } from '../../../src/requests/translations/IUpdateTranslationBody';
import { AuditLogService } from '../../../src/services/AuditLogService';
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
			// eslint-disable-next-line @typescript-eslint/no-empty-function
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
		const testCreateTranslation = async (
			params: IUpdateTranslationBody,
			expectedChanges: Pick<ChangeLogChange, 'key' | 'value'>[],
		): Promise<void> => {
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
				(entity) => entity instanceof Revision,
			)[0] as Revision;

			expect(revision).toBeInstanceOf(Revision);
			expect(revision.changeLogEntries.length).toBe(1);

			const changeLogEntry = revision
				.changeLogEntries[0] as TranslationChangeLogEntry;
			expect(changeLogEntry).toBeInstanceOf(TranslationChangeLogEntry);

			expect(changeLogEntry.revision.getEntity()).toBe(revision);
			expect(changeLogEntry.changes.length).toBe(expectedChanges.length);
			expect(changeLogEntry.actor).toBe(existingUser);
			expect(changeLogEntry.actionType).toBe(ChangeLogEvent.Created);
			expect(changeLogEntry.translation).toBe(translation);

			for (let i = 0; i < changeLogEntry.changes.length; i++) {
				const changeLogChange = changeLogEntry.changes[i];
				expect(changeLogChange).toBeInstanceOf(ChangeLogChange);
				expect(changeLogChange.changeLogEntry).toBe(changeLogEntry);

				const { key, value } = expectedChanges[i];
				expect(changeLogChange.key).toBe(key);
				expect(changeLogChange.value).toBe(value);
			}

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
			const userGroups = Object.values(UserGroup).filter(
				(userGroup) => userGroup !== UserGroup.Admin,
			);

			for (const userGroup of userGroups) {
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
			await testCreateTranslation(defaults, [
				{
					key: ChangeLogChangeKey.Translation_Headword,
					value: defaults.headword,
				},
				{
					key: ChangeLogChangeKey.Translation_Locale,
					value: defaults.locale,
				},
				{
					key: ChangeLogChangeKey.Translation_Reading,
					value: defaults.reading,
				},
				{
					key: ChangeLogChangeKey.Translation_Yamatokotoba,
					value: defaults.yamatokotoba,
				},
				{
					key: ChangeLogChangeKey.Translation_Category,
					value: defaults.category,
				},
			]);
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
